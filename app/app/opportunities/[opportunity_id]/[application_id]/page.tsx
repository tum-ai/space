import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import db from "server/db";

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

  return (
    <div>
      <ApplicationForm application={application}></ApplicationForm>
    </div>
  );
}
