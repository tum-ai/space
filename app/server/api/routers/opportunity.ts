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
          status: "MISSING_CONFIG",
          admin: { connect: { id: ctx.session.user.id } },
        },
      });

      return opportunity;
    }),

  update: protectedProcedure
    .input(OpportunitySchema)
    .mutation(async ({ input, ctx }) => {
      // Update phases and questionnaires
      const deletePhases = ctx.db.phase.deleteMany({
        where: {
          opportunityId: input.id,
          id: { not: { in: input.phases.map((phase) => phase.id!) } },
        },
      });

      const upsertPhases = input.phases.map((phase) => {
        return ctx.db.phase.upsert({
          where: { id: phase.id } satisfies Prisma.PhaseWhereUniqueInput,

          create: {
            opportunity: { connect: { id: input.id } },
            name: phase.name,
            questionnaires: {
              createMany: {
                data: phase.questionnaires satisfies Prisma.QuestionnaireCreateManyPhaseInput[],
              },
            } satisfies Prisma.QuestionnaireCreateNestedManyWithoutPhaseInput,
          } satisfies Prisma.PhaseCreateInput,

          update: {
            name: phase.name,
            questionnaires: {
              updateMany: {
                where: { phaseId: phase.id },
                data: phase.questionnaires,
              } satisfies Prisma.QuestionnaireUpdateManyWithWhereWithoutPhaseInput,
            },
          } satisfies Prisma.PhaseUpdateInput,
        } satisfies Prisma.PhaseUpsertArgs);
      });

      // Update opportunity
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
        },
      });

      return await ctx.db.$transaction([
        deletePhases,
        ...upsertPhases,
        updateOpportunity,
      ]);
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
