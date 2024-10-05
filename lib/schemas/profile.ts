import { z } from "zod";

export const ProfileSchema = z.object({
  userId: z.string(),
  description: z.string().optional(),
  nationality: z.string().optional(),
  birthday: z
    .date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), {
      message: "You must be at least 16 years old.",
    })
    .optional(),
  university: z
    .string()
    .min(2, {
      message: "University must be at least 2 characters.",
    })
    .optional(),
  degreeName: z.string().optional(),
  degreeLevel: z.string().optional(),
  degreeSemester: z.number().positive().optional(),
});
