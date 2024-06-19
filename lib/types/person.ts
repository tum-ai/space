import { PersonSchema } from "@lib/schemas/person";
import { z } from "zod";

export type Person = z.infer<typeof PersonSchema>;
