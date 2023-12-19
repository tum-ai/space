"use client";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

export const LoginForm = async ({ setResetPassword }) => {
  const router = useRouter();

  const profileRoute = () => {
    router.push("/profile");
  };

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
      <Button onClick={() => signOut()}> Sign out</Button>
      <Button onClick={profileRoute}>View Profile</Button>
    </div>
  );
};
