import { z } from "zod";

export const PersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  tags: z.array(z.object({ text: z.string(), color: z.string() })),
  image: z.string(),
});

export const QuestionSchema = z
  .object({
    type: z.union([
      z.literal("select"),
      z.literal("slider"),
      z.literal("textarea"),
    ]),
    question: z.string(),
    options: z.array(z.string()).optional(),
    maxValue: z.number().optional(),
  })
  .refine(
    (data) =>
      data.type !== "select" || (data.options && data.options.length > 0),
    {
      message: "Options are required when type is 'select'.",
    },
  );

export const FormSchema = z.object({
  formName: z.string(),
  questions: z.array(QuestionSchema),
});

export const PhaseSchema = z.object({
  name: z.string(),
  forms: z.array(FormSchema),
});

export const GeneralInformationSchema = z
  .object({
    tallyID: z.string().min(1, "TallyID is required"),
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
      ),
    description: z.string().min(1, "Description is required"),
    admins: z.array(PersonSchema).min(1, "At least one admin required"),
    screeners: z.array(PersonSchema),
  })
  .refine(
    (data) => {
      return data.start && data.end && data.start <= data.end;
    },
    {
      message: "Begin date must be before end date",
      path: ["end"],
    },
  );

export const FullFormSchema = z.object({
  generalInformation: GeneralInformationSchema,
  defineSteps: z.array(PhaseSchema).min(1, "Add at least one phase"),
});
