import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { FullFormSchema } from "app/opportunities/create/schema";

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
});
