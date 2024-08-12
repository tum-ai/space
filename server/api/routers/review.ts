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

      const review = await ctx.db.review.findUnique({
        where: { id },
        include: { application: true },
      });

      if (!review) {
        throw new Error("Review not found");
      }

      const opportunity = await ctx.db.opportunity.findUnique({
        where: { id: review.application.opportunityId },
        include: { admins: true },
      });

      if (
        !opportunity?.admins.some(
          (admin) => admin.id === ctx.session.user.id,
        ) &&
        review.userId !== ctx.session.user.id
      ) {
        throw new Error("Unauthorized");
      }

      await ctx.db.review.update({
        data: { content, status },
        where: { id },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const review = await ctx.db.review.findUnique({
        where: { id },
        include: { application: true },
      });

      if (!review) {
        throw new Error("Review not found");
      }

      const opportunity = await ctx.db.opportunity.findUnique({
        where: { id: review.application.opportunityId },
        include: { admins: true },
      });

      if (
        !opportunity?.admins.some(
          (admin) => admin.id === ctx.session.user.id,
        ) &&
        review.userId !== ctx.session.user.id
      ) {
        throw new Error("Unauthorized");
      }

      return await ctx.db.review.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
