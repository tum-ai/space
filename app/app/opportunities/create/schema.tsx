import { z } from "zod";

const PersonSchema = z.object({
  id: z.number(),
  tags: z.array(z.string()).optional(),
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

const FormSchema = z.object({
  formName: z.string(),
  questions: z.array(QuestionSchema),
})

const PhaseSchema = z.object({
  phaseName: z.string(),
  forms: z.array(FormSchema),
})

const GeneralInformationSchema = z.object({
  tallyID: z.string(),
  name: z.string(),
  begin: z.date(),
  end: z.date(),
  description: z.string(),
  admins: z.array(PersonSchema),
  screeners: z.array(PersonSchema),
});

const DefineStepsSchema = z.object({
  phases: z.array(PhaseSchema),
});

const FullFormSchema = z.object({
  generalInformation: GeneralInformationSchema,
  defineSteps: DefineStepsSchema,
});

export { FullFormSchema };
