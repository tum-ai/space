import { getServerAuthSession } from "server/auth";
import { EditGeneral } from "./_components/general";
import { redirect } from "next/navigation";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@components/ui/page-breadcrumbs";
import { Separator } from "@components/ui/separator";
import { type Prisma } from "@prisma/client";
import db from "server/db";
import { PhaseContextProvider } from "./_components/phaseContextProvider";
import type { Phases, Phase } from "@lib/types/opportunity";
import { EditPhasesForm } from "./_components/phases/editPhasesForm";
import { TallyForm } from "./_components/tally/tallyForm";

export type PhaseEditOpportunity = Prisma.OpportunityGetPayload<{
  include: {
    admins: true;
    phases: {
      include: { questionnaires: { include: { reviewers: true } } };
    };
  };
}>;

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default async function OpportunityEdit({ params }: Props) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunityId = params.opportunity_id;

  const opportunity = await db.opportunity.findUnique({
    where: {
      id: Number(opportunityId),
      admins: { some: { id: userId } },
    },
    include: {
      admins: true,
      phases: {
        include: {
          questionnaires: {
            include: { reviewers: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!opportunity) redirect("/opportunities");

  const defaultPhases = opportunity.phases.map((phase) => ({
    id: phase.id,
    name: phase.name,
    order: phase.order,
    isInterview: phase.isInterview,
    questionnaires: phase.questionnaires.map((questionnaire) => ({
      id: questionnaire.id,
      name: questionnaire.name,
      requiredReviews: questionnaire.requiredReviews,
      questions: questionnaire.questions,
      conditions: questionnaire.conditions,
      reviewers: questionnaire.reviewers.map((user) => ({
        id: user.id,
        name: user.name,
        image: user.image,
      })),
    })),
  })) as Phase[];

  const upsertPhases = async (input: Phases) => {
    "use server";

    // Update phases and questionnaires
    const phases = await db.$transaction(
      input.phases.map((phase) => {
        return db.phase.upsert({
          where: {
            id: phase.id,
          } satisfies Prisma.PhaseWhereUniqueInput,

          create: {
            opportunity: { connect: { id: Number(opportunityId) } },
            isInterview: phase.isInterview,
            name: phase.name,
            order: phase.order,
          } satisfies Prisma.PhaseCreateInput,

          update: {
            name: phase.name,
            isInterview: phase.isInterview,
            order: phase.order,
          } satisfies Prisma.PhaseUpdateInput,
        } satisfies Prisma.PhaseUpsertArgs);
      }),
    );

    await db.phase.deleteMany({
      where: {
        opportunityId: Number(opportunityId),
        ...(phases.length > 0
          ? { id: { not: { in: phases.map((phase) => phase.id) } } }
          : {}),
      },
    });

    // Update questionnaires
    const questionnaires = await db.$transaction(
      input.phases.flatMap((phase, index) => {
        return phase.questionnaires.map((questionnaire) => {
          return db.questionnaire.upsert({
            where: { id: questionnaire.id ?? "" },
            create: {
              ...questionnaire,
              phase: { connect: { id: phases[index]!.id } },
              reviewers: {
                connect: questionnaire.reviewers.map((reviewer) => ({
                  id: reviewer.id,
                })),
              },
            } satisfies Prisma.QuestionnaireCreateInput,
            update: {
              ...questionnaire,
              phase: { connect: { id: phases[index]!.id } },
              reviewers: {
                set: questionnaire.reviewers.map((reviewer) => ({
                  id: reviewer.id,
                })),
              },
            },
          });
        });
      }),
    );

    await db.questionnaire.deleteMany({
      where: {
        phaseId: { in: phases.map((phase) => phase.id) },
        ...(questionnaires.length > 0
          ? { id: { not: { in: questionnaires.map((q) => q.id) } } }
          : {}),
      },
    });
  };

  const headerList = headers();
  const breadcrumbs = await mapPathnameToBreadcrumbs(headerList);

  return (
    <PhaseContextProvider
      defaultValues={{
        opportunityId: opportunity.id,
        phases: defaultPhases,
      }}
    >
      <div className="space-y-8 py-8">
        <PageHeading
          title="Edit Opportunity"
          breadcrumbs={breadcrumbs}
          description="Configure a opportunity and how it is reviewed"
        />
        <EditGeneral opportunityId={opportunityId} />
        <Separator />
        <EditPhasesForm update={upsertPhases} />
        <Separator />
        <TallyForm opportunityId={opportunityId} />
      </div>
    </PhaseContextProvider>
  );
}
