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
    include: { users: { include: { user: true } } },
  });

  const initialValues: EditOpportunityFormProps["initialValues"] = {
    id: opportunity?.id,
    generalInformation: {
      title: opportunity?.title,
      description: opportunity?.description ?? "",
      start: opportunity?.start,
      end: opportunity?.end ?? undefined,
      admins: opportunity?.users
        .filter((user) => user.opportunityRole === "ADMIN")
        .map((user) => ({
          id: user.userId,
          name: user.user.name ?? undefined,
          image: user.user.image ?? undefined,
        })),
      screeners: opportunity?.users
        .filter((user) => user.opportunityRole === "SCREENER")
        .map((user) => ({
          id: user.userId,
          name: user.user.name ?? undefined,
          image: user.user.image ?? undefined,
        })),
    },
    defineSteps: [],
  };

  return <EditOpportunityForm initialValues={initialValues} />;
}
