import { Button } from "@components/ui/button";
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

  const applications = await db.application.findMany({
    where: {
      opportunityId: Number(params.opportunity_id),
    },
    select: {
      id: true,
      questionnaires: {
        select: {
          id: true,
          requiredReviews: true,
          reviews: true,
          reviewers: true,
        },
      },
    },
  });

  let suitableApplication = null;
  let suitableQuestionnaire = null;

  // Iterate over applications to find the first suitable one
  for (const application of applications) {
    // Find a suitable questionnaire within this application
    suitableQuestionnaire = application.questionnaires.find((questionnaire) => {
      // User is a reviewer
      const isReviewer = questionnaire.reviewers.some(
        (reviewer) => reviewer.id === session.user.id,
      );

      // User has not reviewed questionnaire and application together
      const hasNotReviewed = !questionnaire.reviews.some(
        (review) =>
          review.userId === session.user.id &&
          review.questionnaireId === questionnaire.id &&
          review.applicationId === application.id,
      );

      const lessReviewsThanRequired =
        questionnaire.reviews.filter(
          (review) =>
            review.questionnaireId === questionnaire.id &&
            review.applicationId === application.id,
        ).length < questionnaire.requiredReviews;

      return isReviewer && hasNotReviewed && lessReviewsThanRequired;
    });

    if (suitableQuestionnaire) {
      suitableApplication = application;
      break; // Exit loop once a suitable questionnaire (and thus application) is found
    }
  }

  if (!suitableApplication || !suitableQuestionnaire) {
    // No suitable application or questionnaire found
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Rabbit className="mb-8 h-16 w-16" />
        <p>No applications require your review. Please try again later</p>
        <Button variant="link">
          <Link href="/opportunities">Back to opportunities</Link>
        </Button>
      </div>
    );
  }

  // Proceed to create a review for the found questionnaire and application
  const review = await db.review.create({
    data: {
      content: [],
      userId: session.user.id,
      applicationId: suitableApplication.id,
      questionnaireId: suitableQuestionnaire.id,
      status: "CREATED",
    },
  });

  redirect(`/opportunities/${params.opportunity_id}/review/${review.id}`);
}
