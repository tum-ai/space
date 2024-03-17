import { z } from "zod";

export const PersonSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  image: z.string().optional(),
});
