"use client";
import { Button } from "@components/ui/button";
import { signIn } from "next-auth/react";
import { SlackLogo } from "@phosphor-icons/react";
import { toast } from "sonner";

const Auth = () => {
  return (
    <section>
      <div className="mx-auto max-w-lg space-y-8">
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
      </div>
    </section>
  );
};

export default Auth;
