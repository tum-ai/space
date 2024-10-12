import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { type Opportunity } from "@prisma/client";
import OpportunityCard from "./_components/opportunityCard";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@components/ui/page-breadcrumbs";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ScrollBar, ScrollArea } from "@components/ui/scroll-area";

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

  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const breadcrumbs = await mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="flex flex-col gap-8 overflow-hidden py-8 sm:h-screen">
      <PageHeading title={"Opportunitites"} breadcrumbs={breadcrumbs} />

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
          <Button
            className="flex h-full w-full border-dashed"
            variant="outline"
            asChild
          >
            <Link href={`${pathname}/create`}>
              <Plus className="pr-2" />
              Create Opportunity
            </Link>
          </Button>
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
