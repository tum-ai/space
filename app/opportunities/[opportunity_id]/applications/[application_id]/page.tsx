import Breadcrumbs from "@components/ui/breadcrumbs";
import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import { redirect } from "next/navigation";
import db from "server/db";
import PageTemplate from "@components/PageTemplate";

export default async function ApplicationOverview({
  params,
}: {
  params: { application_id: string };
}) {
  const application = await db.application.findUnique({
    where: {
      id: Number(params.application_id),
    },
  });

  const opportunityTitle = db.opportunity
    .findUnique({
      where: {
        id: application?.opportunityId,
      },
    })
    .then((opportunity) => opportunity?.title);

  // TODO: Better handling
  if (!application) redirect("/");

  return (
    <PageTemplate
      breadcrumbsTitle={`Application: ${application.id}`}
      opportunityTitle={await opportunityTitle}
      pageTitle={`Application of ID: ${application.id}`}
      buttons={[]}
    >
      <ApplicationForm application={application}></ApplicationForm>
    </PageTemplate>
  );
}
