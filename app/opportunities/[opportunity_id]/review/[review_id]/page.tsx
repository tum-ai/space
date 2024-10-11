import db from "server/db";
import { ReviewForm } from "./reviewForm";
import { redirect } from "next/navigation";
import { type Question } from "@lib/types/question";
import { getServerAuthSession } from "server/auth";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@lib/utils";
import { PageBreadcrumbs } from "@components/ui/page-breadcrumbs";

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
    },
    include: { application: true, questionnaire: true, user: true },
  });

  const opportunity = await db.opportunity.findUnique({
    where: {
      id: review?.application.opportunityId,
    },
    include: { admins: true },
  });

  if (
    !review ||
    (review?.user.id !== session.user.id &&
      !opportunity?.admins.map((admin) => admin.id).includes(session.user.id))
  ) {
    redirect("/404");
  }

  const questions = review.questionnaire.questions as Question[];

  const headerList = headers();
  const breadcrumbs = mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="flex h-screen flex-col py-8">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} className="mb-1" />
      <ReviewForm
        questions={questions}
        application={review.application}
        review={review}
      />
    </div>
  );
}
