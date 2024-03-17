// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_TALLY_SIGNING_SECRET: z.string(),
    NEXT_PUBLIC_VERCEL_ENV: z.enum(["development", "production", "preview"]),
    NEXT_PUBLIC_SLACK_CLIENT_ID: z.string(),
    NEXT_PUBLIC_SLACK_CLIENT_SECRET: z.string(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_TALLY_SIGNING_SECRET:
      process.env.NEXT_PUBLIC_TALLY_SIGNING_SECRET ?? "",
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_SLACK_CLIENT_ID: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
    NEXT_PUBLIC_SLACK_CLIENT_SECRET:
      process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET,
  },
});
