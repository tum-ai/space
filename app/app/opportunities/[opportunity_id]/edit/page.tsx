import { redirect } from "next/navigation";
import {
  EditOpportunityForm,
  EditOpportunityFormProps,
} from "./editOpportunityForm";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { FullFormSchema } from "@lib/schemas/opportunity";
import { z } from "zod";
interface EditOpportunityProps {
  params: { opportunity_id: string };
}

export default async function EditOpportunity({
  params,
}: EditOpportunityProps) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunity = await db.opportunity.findUnique({
    where: {
      id: Number(params.opportunity_id),
      users: {
        some: { userId, opportunityRole: "ADMIN" },
      },
    },
    include: { users: { include: { user: true } } },
  });
  const configuration = opportunity?.configuration as z.infer<
    typeof FullFormSchema
  >["defineSteps"];

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
    defineSteps: configuration,
  };

  return <EditOpportunityForm initialValues={initialValues} />;
}
