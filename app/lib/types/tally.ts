import { TallySchema } from "@lib/schemas/tally";
import { z } from "zod";

export type Tally = z.infer<typeof TallySchema>;
