import { Button } from "@components/ui/button";
import { env } from "app/env.mjs";
import { signIn } from "next-auth/react";
import Link from "next/link";

export const LoginForm = () => {
  const isDevelopment = env.NEXT_PUBLIC_VERCEL_ENV === "development";

  return (
    <div className="m-auto flex max-w-[500px] flex-col gap-4 ">
      <h2 className="flex justify-center text-3xl">Login</h2>
      <hr className="col-span-2" />
      <Button
        className="flex items-center justify-center rounded-lg border border-transparent bg-white px-4 py-2 text-sm font-medium text-black shadow-sm"
        onClick={() => signIn("slack")}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png"
          alt="Slack logo"
          className="mr-2 h-6 w-6"
        />
        Log in with Slack
      </Button>
      {isDevelopment && (
        <>
          <Button asChild>
            <Link href="auth/signin">Log in with Credentials</Link>
          </Button>
          <Button asChild>
            <Link href="auth/signup">Register</Link>
          </Button>
        </>
      )}
    </div>
  );
};
