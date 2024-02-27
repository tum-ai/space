import { z } from "zod";

const TextQuestionSchema = z.object({
  type: z.literal("text"),
  value: z.string().optional(),
});

const SelectQuestionSchema = z.object({
  type: z.literal("select"),
  options: z.array(z.string()),
  value: z.string().optional(),
});

const SliderSchema = z.object({
  type: z.literal("slider"),
  range: z.tuple([z.number(), z.number()]),
  value: z.number().optional(),
});

export const QuestionSchema = z
  .object({
    question: z.string(),
  })
  .and(TextQuestionSchema.or(SelectQuestionSchema).or(SliderSchema));

export type Question = z.infer<typeof QuestionSchema>;
