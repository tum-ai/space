"use client";
import { LoginForm } from "./components/LoginForm";
import { env } from "env.mjs";
import { Button } from "@components/ui/button";
import { signIn } from "next-auth/react";
import { SlackLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { toast } from "sonner";

const Auth = () => {
  const isDevelopment = env.NEXT_PUBLIC_VERCEL_ENV === "development";

  return (
    <section>
      <div className="mx-auto max-w-lg space-y-8">
        {isDevelopment && <LoginForm />}
        {!isDevelopment && (
          <Button
            className="w-full"
            onClick={() =>
              toast.promise(signIn("slack"), {
                loading: "Logging in with slack",
                success: "Redirecting to slack. See you soon!",
                error: "Failed to login. Please retry later",
              })
            }
          >
            <SlackLogo size={20} className="mr-2" /> Log in with Slack
          </Button>
        )}
        {isDevelopment && (
          <p className="w-full text-center">
            Don&apos;t have an account?{" "}
            <Link href="auth/register" className="underline">
              Register
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default Auth;
