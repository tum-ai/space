import { QuestionSchema } from "@lib/schemas/question";
import { z } from "zod";
import { PersonSchema } from "./person";

export const QuestionnaireSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Questionnaire name is required"),
  requiredReviews: z.number().int().min(1, "At least one review is required"),
  conditions: z.object({ key: z.string(), value: z.string() }).array(),
  questions: QuestionSchema.array(),
  reviewers: PersonSchema.array(),
});

export const PhaseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Phase name is required"),
  questionnaires: z.array(QuestionnaireSchema),
});

export const PhasesSchema = z.object({
  opportunityId: z.number().optional(),
  phases: z.array(PhaseSchema),
});

export const GeneralInformationSchema = z
  .object({
    opportunityId: z.number().optional(),
    admins: PersonSchema.array().min(1, "At least one admin is required"),
    title: z.string().min(1, "Opportunity name is required"),
    start: z
      .date()
      .refine(
        (date) => date.toString() !== "Invalid Date",
        "Begin date is required",
      ),
    end: z
      .date()
      .refine(
        (date) => date.toString() !== "Invalid Date",
        "End date is required",
      )
      .optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      return !data.end || data.start <= data.end;
    },
    {
      message: "Begin date must be before end date",
      path: ["end"],
    },
  );
