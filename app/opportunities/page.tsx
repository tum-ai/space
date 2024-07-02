import { Plus, Rabbit } from "lucide-react";
import OpportunityCard from "./_components/opportunityCard";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import PageHeader from "@components/PageHeader";
import PageTemplate from "@components/PageTemplate";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunities = await db.opportunity.findMany({
    where: {
      OR: [
        // user is admin of opportunity
        { admins: { some: { id: userId } } },
        // or user is a reviewer of a questionnaire in the opportunity
        {
          phases: {
            some: {
              questionnaires: { some: { reviewers: { some: { id: userId } } } },
            },
          },
        },
      ],
    },
    include: { admins: true },
  });

  const createNewOpportunityButton = (
    <Link href="./opportunities/create">
      <Button className="flex w-full  items-center justify-center sm:h-auto sm:w-auto">
        <Plus className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Create new</span>
      </Button>
    </Link>
  );

  return (
    <PageTemplate
      breadcrumbsTitle="Opportunities"
      pageTitle="Opportunities"
      pageDescription="Manage your opportunities."
      buttons={[createNewOpportunityButton]}
    >
      {!opportunities.length && (
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <Rabbit className="mb-8 h-16 w-16" />
            <p>No opportunities found.</p>
          </div>
          <Button variant="link">
            <Link href="opportunities/create">Create Opportunity</Link>
          </Button>
        </div>
      )}
      {!!opportunities.length && (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {opportunities?.map((item, index) => {
            return (
              <OpportunityCard
                isAdmin={item.admins.some((admin) => admin.id === userId)}
                opportunity={item}
                key={index}
              />
            );
          })}
        </div>
      )}
    </PageTemplate>
  );
}
