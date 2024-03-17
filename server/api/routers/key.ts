import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { LogEntry } from "@lib/types/key";

export const keyRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.key.create({
      data: { userId: ctx.session.user.id, log: [] },
    });
  }),

  deleteById: protectedProcedure
    .input(z.object({ keyId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.roles.includes("ADMIN")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to be an admin to delete this key",
        });
      }

      return await ctx.db.key.delete({ where: { id: input.keyId } });
    }),

  giveAway: protectedProcedure
    .input(z.object({ keyId: z.number(), recipientId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const key = await ctx.db.key.findUnique({
        where: { id: input.keyId },
      });

      if (key?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not own this key or it does not exist",
        });
      }

      const recipient = await ctx.db.user.findUnique({
        where: { id: input.recipientId },
      });

      const log = [
        ...(key.log as unknown as LogEntry[]),
        { user: recipient, date: new Date() },
      ];

      return await ctx.db.key.update({
        data: {
          ...key,
          userId: input.recipientId,
          log,
        },
        where: { id: key.id },
      });
    }),
});
