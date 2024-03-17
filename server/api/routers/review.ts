import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { z } from "zod";

export const reviewRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        // TODO: it would be better if this were a pick<> type on QuestionSchema
        content: z.array(
          z.object({
            key: z.string(),
            value: z.string().optional().or(z.array(z.string()).optional()),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.review.update({
        data: { content: input },
        where: { id: input.id },
      });
    }),
});
