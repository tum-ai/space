import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import { redirect } from "next/navigation";
import db from "server/db";
import PageTemplate from "@components/PageTemplate";
import { api } from "trpc/server";

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

  // TODO: Better handling
  if (!application) redirect("/");

  const opportunityTitle = await api.opportunity.getById
    .query({
      id: application?.opportunityId,
    })
    .then((opportunity) => opportunity?.title);

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
