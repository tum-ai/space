import { z } from "zod";

const CheckboxesSchema = z.object({
  type: z.literal("CHECKBOXES"),
  options: z.array(
    z.object({
      id: z.string().uuid(),
      text: z.string(),
    }),
  ),
  value: z.array(z.string()).optional(),
});

const InputTextSchema = z.object({
  type: z.literal("INPUT_TEXT"),
  value: z.string().optional(),
});

const DropdownSchema = z.object({
  type: z.literal("DROPDOWN"),
  options: z.array(
    z.object({
      id: z.string().uuid(),
      text: z.string(),
    }),
  ),
  value: z.string().optional(),
});

export const QuestionSchema = z
  .object({
    label: z.string(),
    key: z.string(),
  })
  .and(
    z.discriminatedUnion("type", [
      InputTextSchema,
      DropdownSchema,
      CheckboxesSchema,
    ]),
  );

export type Question = z.infer<typeof QuestionSchema>;
