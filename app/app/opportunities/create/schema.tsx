import { z } from "zod";

const PersonSchema = z.object({
  memberId: z.string(),
  memberName: z.string(),
  tags: z.array(z.object({ text: z.string(), color: z.string() })).optional(),
  photoUrl: z.string(),
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
});

const PhaseSchema = z.object({
  phaseName: z.string(),
  forms: z.array(FormSchema).min(1, "At least one form required"),
});

const GeneralInformationSchema = z
  .object({
    tallyID: z.string().min(1, "TallyID is required"),
    name: z.string().min(1, "Opportunity name is required"),
    begin: z
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
      return data.begin && data.end && data.begin <= data.end;
    },
    {
      message: "Begin date must be before end date",
      path: ["end"],
    },
  );


const FullFormSchema = z.object({
  generalInformation: GeneralInformationSchema,
  defineSteps: z.array(PhaseSchema).min(1, "Add at least one phase"),
});

export { FullFormSchema };
