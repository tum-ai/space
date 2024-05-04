import { z } from "zod";
import { ContactType } from "@prisma/client";

// create schema with id
export const ContactSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  username: z.string(),
  type: z.nativeEnum(ContactType),
});

export const ContactSchemaWithProfileId = ContactSchema.omit({ id: true });

export const ContactSchemaWithId = ContactSchema.omit({ profileId: true });
