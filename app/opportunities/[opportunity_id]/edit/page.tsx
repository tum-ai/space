import { getServerAuthSession } from "server/auth";
import { EditGeneral } from "./_components/general";
import { EditPhases } from "./_components/phases";
import { redirect } from "next/navigation";

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default async function OpportunityEdit({ params }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user.id) redirect("/auth");

  const opportunityId = params.opportunity_id;

  return (
    <>
      <EditGeneral opportunityId={opportunityId} />
      <EditPhases opportunityId={opportunityId} />
    </>
  );
}
