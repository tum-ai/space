import { QuestionSchema } from "@lib/schemas/question";
import { z } from "zod";

export type Question = z.infer<typeof QuestionSchema>;
