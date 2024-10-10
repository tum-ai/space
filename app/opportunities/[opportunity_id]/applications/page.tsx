import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import Breadcrumbs from "@components/ui/breadcrumbs";
import { ApplicationOverview } from "./_components/applicationOverview";
import { type Phase, type Questionnaire, type User } from "@prisma/client";
import { ExportButton } from "./_components/exportButton";

export const dynamic = "force-dynamic";

export type OpportunityPhase = Phase & {
  questionnaires: (Questionnaire & {
    reviewers: User[];
    applications: {
      id: number;
      name: string | null;
      reviews?: { id: number; user: User }[];
    }[];
  })[];
};

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default async function ApplicationsPage({ params }: Props) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunityId = Number(params.opportunity_id);

  const opportunity = await db.opportunity.findUnique({
    where: {
      id: opportunityId,
    },
    include: {
      admins: {
        select: {
          id: true,
        },
      },
    },
  });
  const isAdmin = !!opportunity?.admins.some((admin) => admin.id === userId);

  const phases = await db.phase.findMany({
    include: {
      questionnaires: {
        include: {
          applications: {
            select: {
              id: true,
              name: true,
            },
          },
          reviewers: true,
        },
        where: { reviewers: { some: { id: userId } } },
      },
    },
    where: {
      questionnaires: { some: { reviewers: { some: { id: userId } } } },
      opportunityId,
    },
  });

  async function getExportData() {
    "use server";

    return await db.application.findMany({
      where: {
        opportunityId: Number(params.opportunity_id),
      },
      select: {
        content: true,
        name: true,
        reviews: {
          select: {
            content: true,
          },
        },
      },
    });
  }

  return (
    <div className="flex h-screen flex-col gap-8 overflow-hidden p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            title={`Applications`}
            opportunityTitle={opportunity?.title}
          />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Applications for {opportunity?.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <ExportButton getExportData={getExportData} />
        </div>
      </div>

      <ApplicationOverview
        opportunityId={opportunityId}
        phases={phases}
        isAdmin={isAdmin}
      />
    </div>
  );
}
