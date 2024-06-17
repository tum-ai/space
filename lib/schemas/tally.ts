import { z } from "zod";

const TallyCheckboxes = z.object({
  type: z.literal("CHECKBOXES"),
  value: z.union([z.boolean(), z.array(z.string().uuid())]),
  options: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
});

const TallyMultipleChoice = z.object({
  type: z.literal("MULTIPLE_CHOICE"),
  value: z.array(z.string().uuid()).nullable(),
  options: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
});

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

const TallyMatrix = z.object({
  type: z.literal("MATRIX"),
  value: z.record(z.array(z.string())),
  columns: z.array(z.object({ id: z.string(), text: z.string() })),
  rows: z.array(z.object({ id: z.string(), text: z.string() })),
});

export const TallyField = z
  .object({
    key: z.string(),
    label: z.string(),
  })
  .and(
    z.union([
      TallyCheckboxes,
      TallyMultipleChoice,
      TallyFileUpload,
      TallyDropdown,
      TallyMatrix,
      z.object({
        type: z
          .literal("TEXTAREA")
          .or(z.literal("INPUT_TEXT"))
          .or(z.literal("INPUT_NUMBER"))
          .or(z.literal("INPUT_DATE"))
          .or(z.literal("INPUT_EMAIL"))
          .or(z.literal("INPUT_LINK")),
        value: z.string().nullable(),
      }),
    ]),
  );

export const TallyData = z.object({
  responseId: z.string(),
  submissionId: z.string(),
  respondentId: z.string(),
  formId: z.string(),
  formName: z.string(),
  createdAt: z.string().datetime(),
  fields: z.array(TallyField),
});

export const TallySchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string(),
  createdAt: z.string().datetime(),
  data: TallyData,
});
