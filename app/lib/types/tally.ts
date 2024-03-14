import { TallyField, TallySchema } from "@lib/schemas/tally";
import { z } from "zod";

export type Tally = z.infer<typeof TallySchema>;
export type TallyField = z.infer<typeof TallyField>;
