import { QuestionSchema } from "@lib/schemas/question";
import { ReviewStatus } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { z } from "zod";

export const reviewRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        content: QuestionSchema.array(),
        status: z.nativeEnum(ReviewStatus),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, content, status } = input;
      await ctx.db.review.update({
        data: { content, status },
        where: { id },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.review.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
