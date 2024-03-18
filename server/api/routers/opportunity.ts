import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import {
  OpportunitySchema,
  GeneralInformationSchema,
} from "@lib/schemas/opportunity";
import { z } from "zod";
import { Prisma } from "@prisma/client";

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
          admin: { connect: { id: ctx.session.user.id } },
        },
      });

      return opportunity;
    }),

  update: protectedProcedure
    .input(OpportunitySchema)
    .mutation(async ({ input, ctx }) => {
      // Update phases and questionnaires
      const phases = await ctx.db.$transaction(
        input.phases.map((phase) => {
          return ctx.db.phase.upsert({
            where: {
              id: phase.id ?? "",
            } satisfies Prisma.PhaseWhereUniqueInput,

            create: {
              opportunity: { connect: { id: input.id } },
              name: phase.name,
            } satisfies Prisma.PhaseCreateInput,

            update: {
              name: phase.name,
            } satisfies Prisma.PhaseUpdateInput,
          } satisfies Prisma.PhaseUpsertArgs);
        }),
      );

      await ctx.db.phase.deleteMany({
        where: {
          opportunityId: input.id,
          ...(phases.length > 0
            ? { id: { not: { in: phases.map((phase) => phase.id) } } }
            : {}),
        },
      });

      // Update questionnaires
      const questionnaires = await ctx.db.$transaction(
        input.phases.flatMap((phase, index) => {
          return phase.questionnaires.map((questionnaire) => {
            return ctx.db.questionnaire.upsert({
              where: { id: questionnaire.id ?? "" },
              create: {
                ...questionnaire,
                phase: { connect: { id: phases[index]!.id } },
                reviewers: { connect: questionnaire.reviewers },
              } satisfies Prisma.QuestionnaireCreateInput,
              update: {
                ...questionnaire,
                phase: { connect: { id: phases[index]!.id } },
                reviewers: { connect: questionnaire.reviewers },
              },
            });
          });
        }),
      );

      await ctx.db.questionnaire.deleteMany({
        where: {
          phaseId: { in: phases.map((phase) => phase.id) },
          ...(questionnaires.length > 0
            ? { id: { not: { in: questionnaires.map((q) => q.id) } } }
            : {}),
        },
      });

      // Update opportunity
      return await ctx.db.opportunity.update({
        where: {
          id: input.id,
          adminId: ctx.session.user.id,
        },
        data: {
          title: input.generalInformation.title,
          description: input.generalInformation.description,
          start: input.generalInformation.start,
          end: input.generalInformation.end,
        },
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

  deleteById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.opportunity.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getTallySchema: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.opportunity.findFirst({
        where: { id: input.id },
        select: { tallySchema: true },
      });
    }),
});
