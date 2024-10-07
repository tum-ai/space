import { EditGeneral } from "./_components/general";
import { EditPhases } from "./_components/phases";

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default function OpportunityEdit({ params }: Props) {
  const opportunityId = params.opportunity_id;
  return (
    <>
      <EditGeneral opportunityId={opportunityId} />
      <EditPhases opportunityId={opportunityId} />
    </>
  );
}
