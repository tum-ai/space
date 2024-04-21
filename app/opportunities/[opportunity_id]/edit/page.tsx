import { redirect } from "next/navigation";
import {
  EditOpportunityForm,
  EditOpportunityFormProps,
} from "./editOpportunityForm";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { z } from "zod";
import { PhaseSchema } from "@lib/schemas/opportunity";

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
      admins: { some: { id: userId } },
    },
    include: {
      admins: true,
      phases: {
        include: {
          questionnaires: {
            include: { reviewers: true },
          },
        },
      },
    },
  });

  if (!opportunity) redirect("/opportunities");

  const phases = opportunity.phases.map((phase) => ({
    id: phase.id,
    name: phase.name,
    questionnaires: phase.questionnaires.map((questionnaire) => ({
      id: questionnaire.id,
      name: questionnaire.name,
      requiredReviews: questionnaire.requiredReviews,
      questions: questionnaire.questions,
      conditions: questionnaire.conditions,
      reviewers: questionnaire.reviewers.map((user) => ({
        id: user.id,
        name: user.name,
        image: user.image,
      })),
    })),
  })) as z.infer<typeof PhaseSchema>[];

  const initialValues: EditOpportunityFormProps["initialValues"] = {
    id: opportunity?.id,
    generalInformation: {
      admins: opportunity.admins.map((admin) => ({
        id: admin.id,
        name: admin.name ?? undefined,
        image: admin.image ?? undefined,
      })),
      title: opportunity?.title,
      description: opportunity?.description ?? "",
      start: opportunity?.start,
      end: opportunity?.end ?? undefined,
    },
    phases: phases,
  };

  return <EditOpportunityForm initialValues={initialValues} />;
}
