"use client";
import { Button } from "@components/ui/button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import ErrorMessage from "@components/ErrorMessage";
import { signIn, signOut } from "next-auth/react";

export const SignIn = () => {
  const router = useRouter();

  if(process.env.NEXT_PUBLIC_VERCEL_ENV !== 'development') {
    console.error('This page is only available in development mode!');
    router.push('/auth');
    return null; 
  }

  return (
    <Section>
      <Formik
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required(),
          password: Yup.string().required(),
        })}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit = {async (values) => {
          const signInData = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false
          });
          if(signInData?.error) {
            console.log(signInData.error);
          } else {
            return router.push("/profile");
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="m-auto flex max-w-[500px] flex-col gap-4">
            <h2 className="text-3xl">Login</h2>
            <div>
              <Field
                as={Input}
                label="Email"
                type="email"
                name="email"
                placeholder="daniel.korth@tum.com"
                state={touched.email && errors.email && "error"}
                fullWidth
              />
              <ErrorMessage name="email" />
            </div>
            <div>
              <Field
                as={Input}
                label="Password"
                type="password"
                name="password"
                state={touched.password && errors.password && "error"}
                fullWidth
              />
              <ErrorMessage name="password" />
            </div>
            <hr className="col-span-2" />
            <Button type="submit">Log in</Button>
          </Form>
        )}
      </Formik>
    </Section>
  );
};

export default SignIn;
