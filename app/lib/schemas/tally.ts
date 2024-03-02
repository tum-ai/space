import { z } from "zod";

const TallyCheckboxesBoolean = z.object({
  type: z.literal("CHECKBOXES"),
  value: z.boolean(),
});

const TallyCheckboxesOptions = z.object({
  type: z.literal("CHECKBOXES"),
  value: z.array(z.string().uuid()),
  options: z.array(z.object({ id: z.string(), text: z.string() })),
});

const TallyCheckboxes = z.union([
  TallyCheckboxesBoolean,
  TallyCheckboxesOptions,
]);

const TallyFileUpload = z.object({
  type: z.literal("FILE_UPLOAD"),
  value: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
        mimeType: z.string(),
        size: z.number(),
      }),
    )
    .nullable(),
});

const TallyDropdown = z.object({
  type: z.literal("DROPDOWN"),
  value: z.array(z.string().uuid()).nullable(),
  options: z.array(z.object({ id: z.string(), text: z.string() })),
});

const TallyQuestion = z
  .object({
    key: z.string(),
    label: z.string(),
  })
  .and(
    z.union([
      TallyCheckboxes,
      TallyFileUpload,
      TallyDropdown,
      z.object({
        type: z
          .literal("TEXTAREA")
          .or(z.literal("INPUT_TEXT"))
          .or(z.literal("INPUT_DATE"))
          .or(z.literal("INPUT_EMAIL"))
          .or(z.literal("TEXTAREA"))
          .or(z.literal("INPUT_LINK")),
        value: z.string().nullable(),
      }),
    ]),
  );

const TallyData = z.object({
  responseId: z.string(),
  submissionId: z.string(),
  respondentId: z.string(),
  formId: z.string(),
  formName: z.string(),
  createdAt: z.string().datetime(),
  fields: z.array(TallyQuestion),
});

export const TallySchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string(),
  createdAt: z.string().datetime(),
  data: TallyData,
});
