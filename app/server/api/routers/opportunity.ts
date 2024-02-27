import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { GeneralInformationSchema } from "@lib/schemas/opportunity";
import { z } from "zod";

export const opportunityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(GeneralInformationSchema)
    .mutation(async ({ input, ctx }) => {
      const admins = input.admins.map((user) => ({
        user: { connect: { id: user.id } },
        opportunityRole: "ADMIN" as const,
      }));

      const screeners = input.screeners.map((user) => ({
        user: { connect: { id: user.id } },
        opportunityRole: "SCREENER" as const,
      }));

      const opportunity = await ctx.db.opportunity.create({
        data: {
          title: input.title,
          description: input.description,
          start: input.start,
          end: input.end,
          configuration: {},
          status: "MISSING_CONFIG",
          users: {
            create: [...admins, ...screeners],
          },
        },
      });

      return opportunity.id;
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
