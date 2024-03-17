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
});
