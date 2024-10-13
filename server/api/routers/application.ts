import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { connectQuestionnaires } from "server/shared/application";

export const applicationRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return await ctx.db.application.findUnique({
        where: { id: input },
      });
    }),

  getAllByOpportunity: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return await ctx.db.application.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        where: { opportunityId: input },
        orderBy: { createdAt: "desc" },
      });
    }),

  reassignAllApplicationsToQuestionnaires: protectedProcedure
    .input(z.object({ opportunityId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const opportunity = await ctx.db.opportunity.findUnique({
        where: { id: input.opportunityId },
        include: { admins: true },
      });

      if (
        !opportunity?.admins.some((admin) => admin.id !== ctx.session.user.id)
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to be an admin of this opportunity",
        });
      }

      const [applications, questionnaires] = await ctx.db.$transaction([
        ctx.db.application.findMany({
          where: { opportunityId: input.opportunityId },
        }),
        ctx.db.questionnaire.findMany({
          where: { phase: { opportunityId: input.opportunityId } },
        }),
      ]);

      return await ctx.db.$transaction(
        applications.map((application) => {
          return connectQuestionnaires(application, questionnaires);
        }),
      );
    }),
});
