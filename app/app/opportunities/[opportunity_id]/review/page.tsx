import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { columns } from "./columns";
import { DataTable } from "@components/ui/data-table";
import { Session } from "next-auth";
import { Button } from "@components/ui/button";
import { FileCheck } from "lucide-react";
import { toast } from "sonner";

const startReview = async (user: Session["user"], opportunityId: number) => {
  const applicationToReview = await db.application.findFirst({
    where: {
      opportunityId: opportunityId,
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
      status: "CREATED",
    },
  } satisfies Prisma.ReviewCreateArgs);

  redirect("review/" + review.id);
};

export default async function ReviewPage({
  params,
}: {
  params: { opportunity_id: string };
}) {
  const session = await getServerAuthSession();
  if (session?.user?.id) redirect("/auth");

  const reviews = await db.review.findMany({
    where: {
      user: { id: session?.user.id },
      application: { opportunityId: Number(params.opportunity_id) },
    },
    include: {
      application: true,
      questionnaire: { include: { phase: true } },
    },
  });

  if (reviews.length) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex justify-between">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Your reviews
            </h1>
            <p className="text-muted-foreground">See and edit your reviews</p>
          </div>

          <Button
            onClick={() => {
              toast.promise(
                startReview(session!.user, Number(params.opportunity_id)),
                {
                  loading: "Looking for something you can review",
                  error:
                    "Currently there are no applications that require your review",
                  success: "Found application for you to review",
                },
              );
            }}
          >
            <FileCheck className="mr-2" />
            Start new review
          </Button>
        </div>

        <DataTable columns={columns} data={reviews} />
      </div>
    );
  }

  await startReview(session!.user, Number(params.opportunity_id));
}
