import { z } from "zod";

export const UserSchema = z.object({
  email: z.string(),
  name: z.string(),
  image: z.string(),
});
