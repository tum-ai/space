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
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "production", "preview"]),
    NEXT_PUBLIC_AUTH0_SECRET: z.string(),
    NEXT_PUBLIC_AUTH0_BASE_URL: z.string().url(),
    NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL: z.string().url(),
    NEXT_PUBLIC_AUTH0_CLIENT_ID: z.string(),
    NEXT_PUBLIC_AUTH0_CLIENT_SECRET: z.string(),
    NEXT_PUBLIC_AUTH0_AUDIENCE: z.string(),
    NEXT_PUBLIC_AUTH0_SCOPE: z.string(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_AUTH0_SECRET: process.env.NEXT_PUBLIC_AUTH0_SECRET,
    NEXT_PUBLIC_AUTH0_BASE_URL: process.env.NEXT_PUBLIC_AUTH0_BASE_URL,
    NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL: process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL,
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_AUTH0_CLIENT_SECRET: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
    NEXT_PUBLIC_AUTH0_SCOPE: process.env.NEXT_PUBLIC_AUTH0_SCOPE,
    NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
  },
});
