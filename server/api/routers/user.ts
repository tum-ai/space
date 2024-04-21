import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { UserSchema } from "@lib/schemas/user";
import { z } from "zod";

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
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.db.user.findUnique({
          where: {
            id: input.id,
          },
        });
        return res;
      } catch (e) {
        console.error(e);
      }
    }),
  update: protectedProcedure
    .input(UserSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
        },
      });
    }),
});
