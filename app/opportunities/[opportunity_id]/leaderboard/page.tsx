import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { Leaderboard } from "../_components/Leaderboard";
import Breadcrumbs from "@components/ui/breadcrumbs";

interface OpportunityProps {
  params: { opportunity_id: string };
}

export default async function OpportunityPage({ params }: OpportunityProps) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const opportunity = await db.opportunity.findUnique({
    where: {
      id: Number(params.opportunity_id),
      admins: { some: { id: session.user.id } },
    },
  });

  const reviewer = await db.user.findMany({
    where: {
      reviews: {
        some: {
          application: {
            opportunityId: Number(params.opportunity_id),
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          reviews: {
            where: {
              application: { opportunityId: Number(params.opportunity_id) },
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            title={"Leaderboard"}
            opportunityTitle={opportunity?.title}
          />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            See who is carrying this student initiative
          </p>
        </div>
      </div>

      <Leaderboard
        reviewers={reviewer.map((reviewer) => ({
          name: reviewer.name ?? reviewer.id,
          applicationsReviewed: reviewer._count.reviews,
        }))}
      />
    </div>
  );
}
