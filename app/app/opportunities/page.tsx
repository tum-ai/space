import { Plus, Rabbit } from "lucide-react";
import OpportunityCard from "./_components/opportunityCard";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunities = await db.opportunity.findMany({
    where: {
      OR: [
        { adminId: userId },
        {
          phases: {
            some: {
              questionnaires: {
                some: { userOnQuestionnaire: { some: { userId } } },
              },
            },
          },
        },
      ],
    },
  });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Opportunities
          </h1>
          <Link href="./opportunities/create">
            <Button>
              <Plus className="mr-2" />
              Create new
            </Button>
          </Link>
        </div>

        {!opportunities.length && (
          <div className="flex h-[50vh] flex-col items-center justify-center">
            <div className="flex flex-col items-center text-muted-foreground">
              <Rabbit className="mb-8 h-16 w-16" />
              <p>
                {/* TODO: Not correct for non-admin users */}
                No opportunities found. Create a new opportunity to get started.
              </p>
            </div>

            <Button variant="link">
              <Link href="opportunities/create">Create Opportunity</Link>
            </Button>
          </div>
        )}
        {!!opportunities.length && (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {opportunities?.map((item, index) => {
              return (
                <OpportunityCard
                  canEdit={item.adminId === userId}
                  opportunity={item}
                  key={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
