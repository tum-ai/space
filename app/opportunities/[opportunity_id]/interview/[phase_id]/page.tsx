import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import {
  type Application,
  type Questionnaire,
  type User,
} from "@prisma/client";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@components/ui/page-breadcrumbs";

interface Props {
  params: {
    phase_id: string;
  };
}

export type PhaseApplication = {
  id: number;
  name: string | null;
  reviews: {
    id: number;
    user: User;
  }[];
  questionnaires: {
    id: string;
    name: string;
    phase: {
      id: string;
      name: string;
      isCurrent: boolean;
    };
  }[];
  inPhase: boolean;
};

export default async function PhasePage({ params }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const phase = await db.phase.findUnique({
    where: { id: params.phase_id },
    include: {
      opportunity: true,
    },
  });

  if (!phase || !phase.isInterview) redirect("/404");

  const opportunity = await db.opportunity.findUnique({
    where: { id: phase.opportunityId },
    select: {
      id: true,
      admins: { select: { id: true } },
    },
  });

  if (!opportunity?.admins.map((admin) => admin.id).includes(session.user.id))
    return redirect("/auth");

  const questionnaires = await db.questionnaire.findMany({
    where: { phaseId: phase.id },
  });

  const applications = await db.application.findMany({
    where: { opportunityId: opportunity.id },
    select: {
      id: true,
      name: true,
      reviews: {
        select: {
          id: true,
          user: true,
        },
      },
      questionnaires: {
        select: {
          id: true,
          name: true,
          phase: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const applicationsWithInPhase: PhaseApplication[] = applications.map(
    (application) => ({
      ...application,
      questionnaires: application.questionnaires.map((q) => ({
        id: q.id,
        name: q.name,
        phase: {
          ...q.phase,
          isCurrent: q.phase.id === phase.id,
        },
      })),
      inPhase: application.questionnaires.some((q) => q.phase.id === phase.id),
    }),
  );

  async function assignToQuestionnaire(
    isAdd: boolean,
    applicationIds: Application["id"][],
    questionnaireId: Questionnaire["id"],
  ) {
    "use server";

    await db.questionnaire.update({
      where: { id: questionnaireId },
      data: {
        applications: {
          [isAdd ? "connect" : "disconnect"]: applicationIds.map((id) => ({
            id,
          })),
        },
      },
    });

    return;
  }

  const headerList = headers();
  const breadcrumbs = await mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="flex flex-col gap-8 py-8">
      <PageHeading
        title={phase.name}
        breadcrumbs={breadcrumbs}
        description="Invite applicants to interviews"
      />

      <DataTable
        columns={columns}
        data={applicationsWithInPhase}
        questionnaires={questionnaires}
        assignToQuestionnaire={assignToQuestionnaire}
      />
    </div>
  );
}
