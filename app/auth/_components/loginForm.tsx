"use client";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export const LoginForm = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Button className="w-full">Login</Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            toast.promise(signIn("slack"), {
              loading: "Logging in with slack",
              success: "Redirecting to slack. See you soon!",
              error: "Failed to login. Please retry later",
            })
          }
        >
          Login with Slack
        </Button>
      </CardFooter>
    </Card>
  );
};
