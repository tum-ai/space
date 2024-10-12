import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { TimestampLineChart } from "./_components/timestamp-line-chart";
import { PageHeading } from "@components/ui/page-heading";
import { ReviewsChart } from "./_components/reviews-chart";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@lib/utils";
import { Leaderboard } from "./_components/leaderboard";

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default async function OpportunitiesDashboardPage({ params }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const opportunityId = Number(params.opportunity_id);

  const opportunity = await db.opportunity.findUnique({
    where: {
      id: opportunityId,
    },
    include: {
      applications: {
        select: {
          id: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
      admins: {
        select: {
          id: true,
        },
      },
    },
  });

  const isAdmin = !!opportunity?.admins.some(
    (admin) => admin.id === session.user.id,
  );

  if (!isAdmin) {
    redirect("/auth");
  }

  const reviews = await db.review.findMany({
    include: {
      user: true,
    },
    where: {
      application: { opportunityId },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!opportunity?.applications) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application per day</CardTitle>
          <CardDescription>No applications available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const headerList = headers();
  const breadcrumbs = mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="flex flex-col gap-8 py-8">
      <PageHeading title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="grid auto-rows-fr gap-4 lg:grid-cols-3">
        <TimestampLineChart
          title={"Applications"}
          applications={opportunity.applications}
        />
        <TimestampLineChart title="Reviews" applications={reviews} />
        <ReviewsChart reviews={reviews} />

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Top reviewer</CardTitle>
            <CardDescription>
              See who is carrying this student initiative
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center">
            <Leaderboard reviews={reviews} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
