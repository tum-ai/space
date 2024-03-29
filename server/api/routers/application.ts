import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const applicationRouter = createTRPCRouter({
  getAllByOpportunityId: protectedProcedure
    .input(
      z.object({
        opportunityId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.application.findMany({
        where: {
          opportunityId: input.opportunityId,
        },
      });
    }),

  getFirstByOpportunityId: protectedProcedure
    .input(
      z.object({
        opportunityId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.application.findFirst({
        where: {
          opportunityId: input.opportunityId,
        },
      });
    }),
});
