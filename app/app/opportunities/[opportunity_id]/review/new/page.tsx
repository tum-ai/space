import { Button } from "@components/ui/button";
import { Prisma } from "@prisma/client";
import { Rabbit } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";

interface StartReviewProps {
  params: { opportunity_id: string };
}
export default async function StartReview({ params }: StartReviewProps) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const applicationToReview = await db.application.findFirst({
    where: {
      opportunityId: Number(params.opportunity_id),
      questionnaires: {
        some: { reviewers: { some: { id: session.user.id } } },
      },
      reviews: { none: { userId: session.user.id } },
    },
    include: {
      opportunity: true,
      questionnaires: {
        include: { phase: true },
        where: {
          reviewers: { some: { id: session.user.id } },
          // TODO only include where count(existing reviews) =< requiredReviews
        },
      },
    },
  });

  if (!applicationToReview?.questionnaires.length)
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground">
          <Rabbit className="mb-8 h-16 w-16" />
          <p>No applications require your review. Please try again later</p>
        </div>

        <Button variant="link">
          <Link href="/opportunities">Back to opportunities</Link>
        </Button>
      </div>
    );

  const review = await db.review.create({
    data: {
      content: {},
      user: { connect: { id: session.user.id } },
      application: { connect: { id: applicationToReview.id } },
      questionnaire: {
        connect: { id: applicationToReview.questionnaires.at(0)?.id },
      },
      status: "CREATED",
    },
  } satisfies Prisma.ReviewCreateArgs);

  redirect("review/" + review.id);
}
