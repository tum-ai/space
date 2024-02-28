import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import {
  FullFormSchema,
  GeneralInformationSchema,
  PersonSchema,
} from "@lib/schemas/opportunity";
import { z } from "zod";

const parseUsers = (
  admins: z.infer<typeof PersonSchema>[],
  screeners: z.infer<typeof PersonSchema>[],
) => {
  const userAdmins = admins.map((user) => ({
    user: { connect: { id: user.id } },
    opportunityRole: "ADMIN" as const,
  }));

  const userScreeners = screeners.map((user) => ({
    user: { connect: { id: user.id } },
    opportunityRole: "SCREENER" as const,
  }));

  return [...userAdmins, ...userScreeners];
};

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
          configuration: {},
          status: "MISSING_CONFIG",
          users: {
            create: parseUsers(input.admins, input.screeners),
          },
        },
      });

      return opportunity;
    }),

  update: protectedProcedure
    .input(FullFormSchema)
    .mutation(async ({ input, ctx }) => {
      const opportunity = await ctx.db.opportunity.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.generalInformation.title,
          description: input.generalInformation.description,
          start: input.generalInformation.start,
          end: input.generalInformation.end,
          configuration: input.defineSteps,
          users: {
            deleteMany: {},
            create: parseUsers(
              input.generalInformation.admins,
              input.generalInformation.screeners,
            ),
          },
        },
      });

      return opportunity;
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
