import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import {
  ContactSchema,
  ContactSchemaWithProfileId,
} from "@lib/schemas/contact";
import { z } from "zod";

import { TRPCError } from "@trpc/server";

export const contactRouter = createTRPCRouter({
  update: protectedProcedure
    .input(ContactSchema)
    .mutation(async ({ input, ctx }) => {

      const userId = await ctx.db.profile.findUnique({
        where: {
          id: input.profileId,
        },
      }).then((profile) => profile?.userId);

      if (ctx.session.user.id !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this contact",
        });
      }

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

      // TODO: check authorization

      await ctx.db.contact.delete({
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(ContactSchemaWithProfileId)
    .mutation(async ({ input, ctx }) => {

      const userId = await ctx.db.profile.findUnique({
        where: {
          id: input.profileId,
        },
      }).then((profile) => profile?.userId);

      if (ctx.session.user.id !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this contact",
        });
      }

      await ctx.db.contact.create({
        data: {
          profileId: input.profileId,
          username: input.username,
          type: input.type,
        },
      });
    }),
});
