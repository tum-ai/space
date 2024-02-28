import { QuestionSchema } from "@lib/schemas/question";
import { z } from "zod";
import { PersonSchema } from "./person";

export const QuestionnaireSchema = z.object({
  name: z.string().min(1, "Questionnaire name is required"),
  questions: z.array(QuestionSchema),
});

export const PhaseSchema = z.object({
  name: z.string().min(1, "Phase name is required"),
  forms: z.array(QuestionnaireSchema),
});

export const GeneralInformationSchema = z
  .object({
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
    admins: z.array(PersonSchema).min(1, "At least one admin required"),
    screeners: z.array(PersonSchema),
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

export const OpportunitySchema = z.object({
  id: z.number().optional(),
  generalInformation: GeneralInformationSchema,
  defineSteps: z.array(PhaseSchema),
});
