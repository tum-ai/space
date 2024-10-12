import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { PageHeading } from "@components/ui/page-heading";
import { mapPathnameToBreadcrumbs } from "@components/ui/page-breadcrumbs";
import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import { headers } from "next/headers";
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

  const headerList = headers();
  const breadcrumbs = await mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="flex h-screen flex-col space-y-8 py-8">
      <PageHeading
        title={application.name ?? ""}
        description={`Application of ${application.name}`}
        breadcrumbs={breadcrumbs}
      >
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm">Questionnaires:</p>
            <div className="space-x-2">
              {application.questionnaires.map((questionnaire) => (
                <Badge key={questionnaire.id} variant="outline">
                  {questionnaire.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </PageHeading>

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
