import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import Breadcrumbs from "@components/ui/breadcrumbs";
import { OpportunityOverview } from "./_components/opportunityOverview";
import { type Phase, type Questionnaire, type User } from "@prisma/client";

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

export default async function OpportunityPage({ params }: Props) {
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
  return (
    <div className="flex h-screen flex-col gap-8 overflow-hidden p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs title={opportunity?.title ?? ""} />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Opportunities
          </h1>
        </div>
      </div>

      <OpportunityOverview
        opportunityId={opportunityId}
        phases={phases}
        isAdmin={isAdmin}
      />
    </div>
  );
}
