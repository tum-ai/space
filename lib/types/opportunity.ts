import { OpportunitySchema, PhaseSchema, QuestionnaireSchema } from "@lib/schemas/opportunity";
import { z } from "zod";

export type Opportunity = z.infer<typeof OpportunitySchema>;
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
export type Phase = z.infer<typeof PhaseSchema>;