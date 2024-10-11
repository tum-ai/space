import { getServerAuthSession } from "server/auth";
import { redirect } from "next/navigation";
import db from "server/db";
import { EditPhasesForm } from "./editPhasesForm";
import { type Prisma } from "@prisma/client";
import type { Phases, Phase } from "@lib/types/opportunity";

export async function EditPhases({ opportunityId }: { opportunityId: string }) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

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

  const defaultValues = {
    opportunityId: opportunity.id,
    phases: defaultPhases,
  };

  async function upsert(input: Phases) {
    "use server";

    // Update phases and questionnaires
    const phases = await db.$transaction(
      input.phases.map((phase) => {
        return db.phase.upsert({
          where: {
            id: phase.id ?? "",
          } satisfies Prisma.PhaseWhereUniqueInput,

          create: {
            opportunity: { connect: { id: input.opportunityId } },
            name: phase.name,
            order: phase.order ?? 0,
          } satisfies Prisma.PhaseCreateInput,

          update: {
            name: phase.name,
          } satisfies Prisma.PhaseUpdateInput,
        } satisfies Prisma.PhaseUpsertArgs);
      }),
    );

    await db.phase.deleteMany({
      where: {
        opportunityId: input.opportunityId,
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
  }

  return <EditPhasesForm defaultValues={defaultValues} update={upsert} />;
}
