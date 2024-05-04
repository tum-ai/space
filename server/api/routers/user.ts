import { UserSchema } from "@lib/schemas/user";
import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(UserSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          image: input.image,
        },
      });
      return user;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.db.user.findMany();
      return res;
    } catch (e) {
      console.error(e);
    }
  }),
});
