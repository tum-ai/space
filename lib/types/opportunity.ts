import { OpportunitySchema } from "@lib/schemas/opportunity";
import { z } from "zod";

export type Opportunity = z.infer<typeof OpportunitySchema>;
