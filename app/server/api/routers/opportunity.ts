import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { FullFormSchema } from "@lib/schemas/opportunity";
import { z } from "zod";

export const opportunityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(FullFormSchema)
    .mutation(async ({ input, ctx }) => {
      const { generalInformation, defineSteps, ...rest } = input;

      const { title, description, start, end } = generalInformation;

      const data = {
        title,
        description,
        start,
        end,
        configuration: {},
      };

      await ctx.db.opportunity.create({
        data,
      });
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.opportunity.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
});
