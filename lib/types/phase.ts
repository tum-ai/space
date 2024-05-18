import { PhaseSchema } from "@lib/schemas/opportunity";
import { z } from "zod";

export type Phase = z.infer<typeof PhaseSchema>;
