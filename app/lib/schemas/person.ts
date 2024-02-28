import { z } from "zod";

export const PersonSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  tags: z.array(z.object({ text: z.string(), color: z.string() })).optional(),
  image: z.string().optional(),
});
