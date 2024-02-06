"use client";
import { Button } from "@components/ui/button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { env } from "env.mjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";

const Register = () => {
  const router = useRouter();
  if (env.NEXT_PUBLIC_VERCEL_ENV !== "development") {
    console.error("This page is only available in development mode!");
    router.push("/auth");
  }

  const registerFormSchema = z
    .object({
      firstName: z.string().min(1, { message: "First name can't be empty" }),
      lastName: z.string().min(1, { message: "Last name can't be empty" }),
      email: z.string().email({ message: "Invalid email address" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ["passwordConfirm"],
    });

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    await axios.post("/api/auth/signup", {
      body: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      },
    });
  };

  return (
    <Section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto grid max-w-lg grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 text-3xl">Registration</h2>

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Daniel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Korth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Confirm Password</FormLabel>
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
            Register
          </Button>
        </form>
      </Form>
    </Section>
  );
};

export default Register;
