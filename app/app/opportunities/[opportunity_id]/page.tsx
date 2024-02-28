import db from "server/db";
import { ApplicationsTable } from "./_components/ApplicationsTable";

export default async function ReviewOverview({
  params,
}: {
  params: { opportunity_id: string };
}) {
  const applications = await db.application.findMany({
    where: {
      opportunityId: Number(params.opportunity_id),
    },
  });

  return (
    <div>
      <ApplicationsTable applications={applications} />
    </div>
  );
}
