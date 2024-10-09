import Breadcrumbs from "@components/ui/breadcrumbs";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Application, Questionnaire, type User } from "@prisma/client";

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
    phaseId: string;
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

  if (!phase) redirect("/404");

  const opportunity = await db.opportunity.findUnique({
    where: { id: phase.opportunityId },
    select: {
      id: true,
      admins: { select: { id: true } },
    },
  });

  // TODO: redirect to unauthorized page
  if (!opportunity?.admins.map((admin) => admin.id).includes(session.user.id))
    return redirect("/");

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
          phaseId: true,
        },
      },
    },
  });

  const applicationsWithInPhase = applications.map((application) => ({
    ...application,
    inPhase: application.questionnaires.some((q) => q.phaseId === phase.id),
  }));

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

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs title={`${phase.name}`} />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Phase {phase.name}
          </h1>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applicationsWithInPhase}
        questionnaires={questionnaires}
        assignToQuestionnaire={assignToQuestionnaire}
      />
    </div>
  );
}
