import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import {
  ContactSchema,
  ContactSchemaWithProfileId,
} from "@lib/schemas/contact";
import { z } from "zod";

export const contactRouter = createTRPCRouter({
  update: protectedProcedure
    .input(ContactSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.contact.update({
        where: {
          id: input.id,
        },
        data: {
          profileId: input.profileId,
          username: input.username,
          type: input.type,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.contact.delete({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(ContactSchemaWithProfileId)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.contact.create({
        data: {
          profileId: input.profileId,
          username: input.username,
          type: input.type,
        },
      });
    }),
});
