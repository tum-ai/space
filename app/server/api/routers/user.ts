import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.db.user.findMany();
      return res;
    } catch (e) {
      console.error(e);
    }
  }),

  /**
   * Get profile by id
   * @param input - user id
   **/
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findUnique({
        where: {
          id: input,
        },
      });
    }),
});
