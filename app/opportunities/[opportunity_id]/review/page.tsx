import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { columns } from "./columns";
import { DataTable } from "@components/ui/data-table";
import { Button } from "@components/ui/button";
import { FileCheck } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@components/ui/breadcrumbs";
import { Progress } from "@components/ui/progress";

interface ReviewPageProps {
  params: { opportunity_id: string };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const opportunity = await db.opportunity.findUnique({
    where: { id: Number(params.opportunity_id) },
  });

  const userReviews = await db.review.findMany({
    where: {
      user: { id: session?.user.id },
      application: { opportunityId: Number(params.opportunity_id) },
    },
    include: {
      application: true,
      questionnaire: { include: { phase: true } },
    },
  });

  const reviewCount = await db.review.count({
    where: {
      status: "DONE",
      application: { opportunityId: Number(params.opportunity_id) },
    },
  });

  const reviewsPerApplication = await db.questionnaire
    .aggregate({
      _sum: {
        requiredReviews: true,
      },
      where: {
        phase: {
          opportunityId: Number(params.opportunity_id),
        },
      },
    })
    .then((res) => res._sum.requiredReviews ?? 1);

  const applicationCount = await db.application.count({
    where: {
      opportunityId: Number(params.opportunity_id),
    },
  });

  const totalRequiredReviews = reviewsPerApplication * applicationCount;
  const progress = (reviewCount / totalRequiredReviews) * 100;

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            title={"Reviews"}
            opportunityTitle={opportunity?.title}
          />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your reviews
          </h1>
          <p className="text-muted-foreground">See and edit your reviews</p>
        </div>

        <Button asChild>
          <Link href="review/new">
            <FileCheck className="mr-2" />
            Start new review
          </Link>
        </Button>
      </div>

      <div>
        <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
          <p className="mb-2 text-lg sm:mb-0">
            <span className="font-semibold">{reviewCount}</span> out of{" "}
            {!!totalRequiredReviews && (
              <span className="font-semibold">{totalRequiredReviews}</span>
            )}{" "}
            reviews submitted
          </p>
          <p className="text-lg font-medium text-muted-foreground">
            {progress.toFixed(0)}% Complete
          </p>
        </div>
        <Progress value={progress} className="h-2 w-full" />
      </div>

      <DataTable columns={columns} data={userReviews} />
    </div>
  );
}
