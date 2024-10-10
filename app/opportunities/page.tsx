import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import Breadcrumbs from "@components/ui/breadcrumbs";
import { type Opportunity } from "@prisma/client";
import OpportunityCard from "./_components/opportunityCard";

export const dynamic = "force-dynamic";

export type OverviewOpportunity = Opportunity & {
  isAdmin: boolean;
};

export default async function OpportunitiesPage() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunities = (
    await db.opportunity.findMany({
      where: {
        OR: [
          { admins: { some: { id: userId } } },
          {
            phases: {
              some: {
                questionnaires: {
                  some: { reviewers: { some: { id: userId } } },
                },
              },
            },
          },
        ],
      },
      include: {
        phases: {
          include: {
            questionnaires: {
              include: {
                applications: {
                  select: {
                    id: true,
                    name: true,
                    reviews: { select: { id: true, user: true } },
                  },
                },
                reviewers: true,
              },
              where: { reviewers: { some: { id: userId } } },
            },
          },
          where: {
            questionnaires: { some: { reviewers: { some: { id: userId } } } },
          },
        },
        admins: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        start: "desc",
      },
    })
  ).map((opportunity) => ({
    ...opportunity,
    isAdmin: opportunity.admins.map((admin) => admin.id).includes(userId),
  }));

  return (
    <div className="flex h-screen flex-col gap-8 overflow-hidden p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs title="Opportunities" />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Opportunities
          </h1>
        </div>
      </div>

      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
}
