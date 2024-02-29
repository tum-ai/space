import { Prisma } from "@prisma/client";
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

  const applicationToReview = await db.application.findFirst({
    where: {
      opportunityId: Number(params.opportunity_id),
      questionnaire: { reviewers: { some: { id: user.id } } },
    },
    include: {
      opportunity: true,
      questionnaire: { include: { phase: true } },
    },
  });

  if (!applicationToReview) redirect("/nothing-to-review");

  const review = await db.review.create({
    data: {
      content: {},
      user: { connect: { id: user.id } },
      application: { connect: { id: applicationToReview.id } },
      questionnaire: { connect: { id: applicationToReview.questionnaire.id } },
    },
  } satisfies Prisma.ReviewCreateArgs);

  redirect("/opportunities/" + params.opportunity_id + "/review/" + review.id);
}
