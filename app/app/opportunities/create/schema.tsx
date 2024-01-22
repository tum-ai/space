import { z } from "zod";

const PersonSchema = z.object({
  id: z.number(),
  tags: z.array(z.string()),
});

const QuestionSchema = z
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

const GeneralInformationSchema = z.object({
  tallyID: z.string(),
  name: z.string(),
  begin: z.date(),
  end: z.date(),
  description: z.string(),
  admins: z.array(PersonSchema),
  screeners: z.array(PersonSchema),
});

const FormWithinPhaseSchema = z.record(z.array(QuestionSchema));

const DefineStepsSchema = z.object({
  phases: z.record(FormWithinPhaseSchema),
});

const FormSchema = z.object({
  generalInformation: GeneralInformationSchema,
  defineSteps: DefineStepsSchema,
});

export { FormSchema };
