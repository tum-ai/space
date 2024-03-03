import { z } from "zod";

const CheckboxQuestionSchema = z.object({
  type: z.literal("CHECKBOXES"),
  options: z.array(
    z.object({
      id: z.string().uuid(),
      text: z.string(),
    }),
  ),
  value: z.string().optional(),
});

const TextQuestionSchema = z.object({
  type: z.literal("INPUT_TEXT"),
  value: z.string().optional(),
});

const SliderSchema = z.object({
  type: z.literal("DROPDOWN"),
  options: z.array(
    z.object({
      id: z.string().uuid(),
      text: z.string(),
    }),
  ),
  value: z.number().optional(),
});

export const QuestionSchema = z
  .object({
    label: z.string(),
  })
  .and(TextQuestionSchema.or(SliderSchema).or(CheckboxQuestionSchema));

export type Question = z.infer<typeof QuestionSchema>;
