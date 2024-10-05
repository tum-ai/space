import { TallyData, TallyField, TallySchema } from "@lib/schemas/tally";
import { z } from "zod";

export type Tally = z.infer<typeof TallySchema>;
export type TallyData = z.infer<typeof TallyData>;
export type TallyField = z.infer<typeof TallyField>;
