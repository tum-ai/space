import { z } from "zod";

export const ArrayOptionsSchema = z.array(
  z.object({
    id: z.string().uuid(),
    text: z.string(),
  }),
);

export const CheckboxesSchema = z.object({
  type: z.literal("CHECKBOXES"),
  options: ArrayOptionsSchema,
  value: z.string().array().optional(),
});

export const InputTextSchema = z.object({
  type: z.literal("INPUT_TEXT"),
  value: z.string().optional(),
});

export const DropdownSchema = z.object({
  type: z.literal("DROPDOWN"),
  options: ArrayOptionsSchema,
  value: z.string().optional(),
});

export const NumericSchema = z.object({
  type: z.literal("NUMERIC"),
  options: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .refine((options) => options.min < options.max, {
      message: "Max must be larger than min :)",
      path: ["max"],
    }),
  value: z.number().optional(),
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
      NumericSchema,
    ]),
  );

export function isArrayOptions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any,
): options is z.infer<typeof ArrayOptionsSchema> {
  return ArrayOptionsSchema.safeParse(options).success;
}

export type Question = z.infer<typeof QuestionSchema>;
