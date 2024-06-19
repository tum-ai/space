import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { ProfileSchema } from "@lib/schemas/profile";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  update: protectedProcedure
    .input(ProfileSchema)
    .mutation(async ({ input, ctx }) => {

      await ctx.db.profile.update({
        where: {
          userId: input.userId,
        },
        data: {
          description: input.description,
          birthday: input.birthday,
          nationality: input.nationality,
          university: input.university,
          degreeName: input.degreeName,
          degreeLevel: input.degreeLevel,
          degreeSemester: input.degreeSemester,
        },
      });
    }),
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.profile.findUnique({
        where: {
          userId: input.userId,
        },
      });
    }),
  create: protectedProcedure
    .input(ProfileSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.profile.create({
        data: {
          userId: input.userId,
          activityStatus: "active",
        },
      });
    }),
});
