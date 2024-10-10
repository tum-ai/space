import { Badge } from "@components/ui/badge";
import Breadcrumbs from "@components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";

export default async function ApplicationOverview({
  params,
}: {
  params: { application_id: string };
}) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/auth");

  const application = await db.application.findUnique({
    include: {
      questionnaires: {
        include: {
          reviewers: { select: { id: true } },
        },
      },
    },
    where: {
      id: Number(params.application_id),
    },
  });

  const opportunity = await db.opportunity.findUnique({
    include: { admins: { select: { id: true } } },
    where: {
      id: application?.opportunityId,
    },
  });

  // TODO: Better handling
  if (!application || !opportunity) redirect("/404");

  const isAdmin = opportunity.admins.some(
    (admin) => admin.id === session.user.id,
  );
  const isReviewer = application.questionnaires.some((questionnaire) =>
    questionnaire.reviewers.some((reviewer) => reviewer.id === session.user.id),
  );

  if (!isAdmin && !isReviewer) redirect("/403");

  return (
    <div className="flex h-screen flex-col space-y-8 p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            title={`Application: ${application.name}`}
            opportunityTitle={opportunity.title}
          />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Application of {application.name}
          </h1>
        </div>

        <div className="flex gap-2">
          <p>Questionnaires:</p>
          <div space-x-2>
            {application.questionnaires.map((questionnaire) => (
              <Badge key={questionnaire.id}>{questionnaire.name}</Badge>
            ))}
          </div>
        </div>
      </div>

      <Card className="h-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex scroll-m-20 justify-between text-2xl font-semibold tracking-tight">
            Application Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationForm application={application} />
        </CardContent>
      </Card>
    </div>
  );
}
