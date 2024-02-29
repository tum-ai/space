import { redirect } from "next/navigation";
import {
  EditOpportunityForm,
  EditOpportunityFormProps,
} from "./editOpportunityForm";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { Prisma } from "@prisma/client";
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

  const opportunityQuery = Prisma.validator<Prisma.OpportunityFindUniqueArgs>()(
    {
      where: {
        id: Number(params.opportunity_id),
        admin: { id: userId },
      },
      include: {
        admin: true,
        phases: {
          include: {
            questionnaires: {
              include: { reviewers: true },
            },
          },
        },
      },
    },
  );

  type DbOpportunity = Prisma.OpportunityGetPayload<typeof opportunityQuery>;

  const opportunity: DbOpportunity | null =
    await db.opportunity.findUnique(opportunityQuery);
  if (!opportunity) redirect("/opportunities");

  const phases = opportunity.phases.map((phase) => ({
    name: phase.name,
    forms: phase.questionnaires.map((questionnaire) => ({
      name: questionnaire.name,
      requiredReviews: questionnaire.requiredReviews,
      questions: questionnaire.questions,
      reviewers: questionnaire.reviewers.map((user) => ({
        id: user.id,
        name: user.name,
        image: user.image,
      })),
    })),
  })) as z.infer<typeof PhaseSchema>[];

  const initialValues: EditOpportunityFormProps["initialValues"] = {
    id: opportunity?.id,
    adminId: opportunity.admin.id,
    generalInformation: {
      title: opportunity?.title,
      description: opportunity?.description ?? "",
      start: opportunity?.start,
      end: opportunity?.end ?? undefined,
    },
    defineSteps: phases,
  };

  return <EditOpportunityForm initialValues={initialValues} />;
}
