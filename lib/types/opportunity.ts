import type {
  PhasesSchema,
  GeneralInformationSchema,
  PhaseSchema,
  QuestionnaireSchema,
} from "@lib/schemas/opportunity";
import { type z } from "zod";

export type GeneralInformation = z.infer<typeof GeneralInformationSchema>;
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type Phases = z.infer<typeof PhasesSchema>;
