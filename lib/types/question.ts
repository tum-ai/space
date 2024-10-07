import { type QuestionSchema } from "@lib/schemas/question";
import { type z } from "zod";

export type Question = z.infer<typeof QuestionSchema>;
