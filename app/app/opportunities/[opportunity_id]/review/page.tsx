import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";

export default async function ReviewPage({
  params,
}: {
  params: { opportunity_id: string };
}) {
  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user?.id) redirect("/auth");

  const awaitingReviews = db.questionnaire.findMany({
    where: {
      phase: { opportunity: { id: Number(params.opportunity_id) } },
      // TODO: Filter by questionnaire.requiredReviews and received reviews
      reviewers: {
        some: {
          id: user.id,
        },
      },
    },
  });

  await db.questionnaire.findMany({});
  // TODO: Show questionnaires where user can start a review
  // When user clicks on a questionnaire, a DB object of type review is already created (He locks this questionnaire)
  return <div></div>;
}
