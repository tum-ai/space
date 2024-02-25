import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const opportunityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        tallyId: z.string(),
        title: z.string(),
        description: z.string(),
        start: z.date(),
        end: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.opportunity.create({
        data: {
          ...input,
          configuration: {},
        },
      });
    }),
});
