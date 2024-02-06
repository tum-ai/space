"use client";
import { Section } from "@components/Section";
import { LoginForm } from "./components/LoginForm";
import { env } from "env.mjs";
import { Button } from "@components/ui/button";
import { signIn } from "next-auth/react";
import { SlackLogo } from "@phosphor-icons/react";
import Link from "next/link";

const Auth = () => {
  const isDevelopment = env.NEXT_PUBLIC_VERCEL_ENV === "development";

  return (
    <Section>
      <div className="mx-auto max-w-lg space-y-8">
        {isDevelopment && <LoginForm />}
        {!isDevelopment && (
          <Button className="w-full" onClick={() => signIn("slack")}>
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
    </Section>
  );
};

export default Auth;
