import { type QuestionnaireSchema } from "@lib/schemas/opportunity";
import { type z } from "zod";

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
