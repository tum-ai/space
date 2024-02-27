import { createTRPCRouter } from "server/api/trpc";
import { userRouter } from "./routers/user";
import { opportunityRouter } from "./routers/opportunity";
import { applicationRouter } from "./routers/application";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  opportunity: opportunityRouter,
  application: applicationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
