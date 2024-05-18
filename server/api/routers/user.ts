import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { UserSchema } from "@lib/schemas/user";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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

      if (ctx.session.user.id !== input.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to be an admin of this opportunity",
        });
      }

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
