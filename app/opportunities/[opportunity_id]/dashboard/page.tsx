import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { TimestampLineChart } from "./_components/timestamp-line-chart";
import { PageHeading } from "@components/ui/page-heading";
import { ReviewsChart } from "./_components/reviews-chart";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@components/ui/page-breadcrumbs";
import { Leaderboard } from "./_components/leaderboard";
import { ApplicantFlowChart } from "./_components/application-flow";
import { Progress } from "@components/ui/progress";
import { Button } from "@components/ui/button";
import { NotebookPen, Users } from "lucide-react";
import Link from "next/link";

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
  const breadcrumbs = await mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="flex flex-col gap-8 py-8">
      <PageHeading title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="grid auto-rows-fr gap-4 md:grid-cols-4 lg:grid-cols-6">
        <div className="col-span-2 row-span-3 grid grid-cols-subgrid grid-rows-subgrid sm:row-span-2">
          <Card className="col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Your Dashboard</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Monitor the status of {opportunity.title} and stay updated with
                the latest applications and reviews.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="edit">
                <Button>Edit Opportunity</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="col-span-2 flex justify-between sm:col-span-1">
            <CardHeader className="pb-2">
              <CardDescription>Applications</CardDescription>
              <CardTitle className="text-4xl">
                {opportunity.applications.length ?? 0}
              </CardTitle>
            </CardHeader>
            <div className="flex items-end justify-end pb-2 pr-2">
              <Users className="h-16 w-16" />
            </div>
          </Card>

          <Card className="col-span-2 flex justify-between sm:col-span-1">
            <CardHeader className="pb-2">
              <CardDescription>Reviews</CardDescription>
              <CardTitle className="text-4xl">{reviews.length ?? 0}</CardTitle>
            </CardHeader>
            <div className="flex items-end justify-end pb-2 pr-2">
              <NotebookPen className="h-16 w-16" />
            </div>
          </Card>
        </div>

        <TimestampLineChart
          className="col-span-2 row-span-2"
          title={"Applications"}
          applications={opportunity.applications}
        />

        <TimestampLineChart
          title="Reviews"
          applications={reviews}
          className="col-span-2 row-span-2"
        />

        <ReviewsChart reviews={reviews} className="col-span-2 row-span-2" />

        <Card className="col-span-2 row-span-2 hidden flex-col sm:flex">
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
