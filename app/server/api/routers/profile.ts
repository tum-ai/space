import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const profileRouter = createTRPCRouter({
  /**
   * Get profile by id
   * @param input - user id
   **/
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findUnique({
        select: {
          id: true,
          email: true,
          image: true,
          departmentMemberships: {
            select: {
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
              departmentPosition: true,
              membershipEnd: true,
              membershipStart: true,
            },
          },
        },
        where: {
          id: input,
        },
      });
    }),
});
