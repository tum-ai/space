import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { Leaderboard } from "./_components/Leaderboard";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@lib/utils";

interface OpportunityProps {
  params: { opportunity_id: string };
}

export default async function OpportunityPage({ params }: OpportunityProps) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

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

  const headerList = headers();
  const breadcrumbs = mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="space-y-8 py-8">
      <PageHeading
        title="Leaderboard"
        description="See who is carrying this student initiative"
        breadcrumbs={breadcrumbs}
      />

      <Leaderboard
        reviewers={reviewer.map((reviewer) => ({
          name: reviewer.name ?? reviewer.id,
          applicationsReviewed: reviewer._count.reviews,
        }))}
      />
    </div>
  );
}
