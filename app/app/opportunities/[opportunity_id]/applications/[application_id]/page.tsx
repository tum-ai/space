import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import { redirect } from "next/navigation";
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

  // TODO: Better handling
  if (!application) redirect("/");

  return (
    <div>
      <ApplicationForm application={application}></ApplicationForm>
    </div>
  );
}
