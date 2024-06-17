import db from "server/db";
import { ReviewForm } from "./reviewForm";
import { redirect } from "next/navigation";
import { Question } from "@lib/types/question";
import { getServerAuthSession } from "server/auth";

interface ReviewProps {
  params: {
    review_id: string;
  };
}

export default async function Review({ params }: ReviewProps) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const review = await db.review.findUnique({
    where: {
      id: Number(params.review_id),
      user: { id: session.user.id },
    },
    include: { application: true, questionnaire: true },
  });

  const opportunityTitle = db.opportunity.findUnique({
    where: {
      id: review?.application.opportunityId,
    },
  }).then((opportunity) => opportunity?.title);

  if (!review) redirect("/404");

  const questions = review.questionnaire.questions as Question[];

  return (
    <ReviewForm
      questions={questions}
      application={review.application}
      review={review}
      opportunityTitle={await opportunityTitle}
    />
  );
}
