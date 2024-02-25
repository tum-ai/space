"use client";
import { Button } from "@components/ui/button";
import Input from "@components/Input";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { env } from "env.mjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { toast } from "sonner";

export const LoginForm = () => {
  const router = useRouter();
  if (env.NEXT_PUBLIC_VERCEL_ENV !== "development") {
    console.error("This page is only available in development mode!");
    router.push("/auth");
  }

  const registerFormSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  });

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    const id = toast.loading("Logging in...");
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      console.log(signInData.error);
    } else {
      toast.success("Logged in!", { id });
      return router.push("/profile");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <h2 className="col-span-2 text-3xl">Login</h2>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="daniel.korth@tum.de"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="col-span-2">
          Login
        </Button>
      </form>
    </Form>
  );
};
