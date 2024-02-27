import {
  EditOpportunityForm,
  EditOpportunityFormProps,
} from "./editOpportunityForm";
import db from "server/db";

interface EditOpportunityProps {
  params: { opportunity_id: string };
}

export default async function EditOpportunity({
  params,
}: EditOpportunityProps) {
  const opportunity = await db.opportunity.findUnique({
    where: { id: Number(params.opportunity_id) },
  });

  const initialValues: EditOpportunityFormProps["initialValues"] = {
    generalInformation: {
      title: opportunity?.title,
      description: opportunity?.description ?? "",
      start: opportunity?.start,
      end: opportunity?.end ?? undefined,
      admins: [],
      screeners: [],
    },
    defineSteps: [],
  };

  return <EditOpportunityForm initialValues={initialValues} />;
}
