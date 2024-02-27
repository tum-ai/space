import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.db.user.findMany();
      return res;
    } catch (e) {
      console.error(e);
    }
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        options: z.object({ withProfile: z.boolean().optional() }).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        include: input.options?.withProfile ? { Profile: true } : {},
      });
    }),
});
