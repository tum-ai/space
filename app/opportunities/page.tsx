import { Plus } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import Breadcrumbs from "@components/ui/breadcrumbs";
import { OpportunityOverview } from "./_components/opportunityOverview";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunities = await db.opportunity.findMany({
    where: {
      OR: [
        { admins: { some: { id: userId } } },
        {
          phases: {
            some: {
              questionnaires: { some: { reviewers: { some: { id: userId } } } },
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
  });

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

      <OpportunityOverview opportunities={opportunities} />
    </div>
  );
}
