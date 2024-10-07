import { type PersonSchema } from "@lib/schemas/person";
import { type z } from "zod";

export type Person = z.infer<typeof PersonSchema>;
