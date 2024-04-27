import { createTRPCRouter } from "server/api/trpc";
import { userRouter } from "./routers/user";
import { opportunityRouter } from "./routers/opportunity";
import { applicationRouter } from "./routers/application";
import { reviewRouter } from "./routers/review";
import { keyRouter } from "./routers/key";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  profile: profileRouter,
  opportunity: opportunityRouter,
  application: applicationRouter,
  review: reviewRouter,
  key: keyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
