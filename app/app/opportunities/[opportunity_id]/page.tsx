import { ApplicationsTable } from "./_components/ApplicationsTable";

export default function ReviewOverview({
  params,
}: {
  params: { opportunity_id: string };
}) {
  return (
    <div>
      <ApplicationsTable opportunity_id={Number(params.opportunity_id)} />
    </div>
  );
}
