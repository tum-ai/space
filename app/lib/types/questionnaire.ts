import { QuestionnaireSchema } from "@lib/schemas/opportunity";
import { z } from "zod";

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
