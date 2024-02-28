import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import {
  OpportunitySchema,
  GeneralInformationSchema,
} from "@lib/schemas/opportunity";
import { z } from "zod";

export const opportunityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(GeneralInformationSchema)
    .mutation(async ({ input, ctx }) => {
      const opportunity = await ctx.db.opportunity.create({
        data: {
          title: input.title,
          description: input.description,
          start: input.start,
          end: input.end,
          status: "MISSING_CONFIG",
          admin: { connect: { id: ctx.session.user.id } },
        },
      });

      return opportunity;
    }),

  update: protectedProcedure
    .input(OpportunitySchema)
    .mutation(async ({ input, ctx }) => {
      const deletePhases = ctx.db.phase.deleteMany({
        where: { opportunityId: input.id },
      });

      const updateOpportunity = ctx.db.opportunity.update({
        where: {
          id: input.id,
          adminId: ctx.session.user.id,
        },
        data: {
          title: input.generalInformation.title,
          description: input.generalInformation.description,
          start: input.generalInformation.start,
          end: input.generalInformation.end,
          phases: {
            deleteMany: {},
            create: input.defineSteps.map((phase) => ({
              name: phase.name,
              index: phase.index,
              questionnaires: {
                create: phase.forms.map((form) => ({
                  name: form.name,
                  requiredReviews: form.requiredReviews,
                  questions: form.questions,
                  userOnQuestionnaire: {
                    create: form.reviewers.map((reviewer) => ({
                      userId: reviewer,
                    })),
                  },
                })),
              },
            })),
          },
        },
      });

      return await ctx.db.$transaction([deletePhases, updateOpportunity]);
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

  deleteById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.opportunity.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
