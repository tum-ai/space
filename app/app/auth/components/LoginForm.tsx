"use client";
import { Button } from "@components/ui/button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import { auth } from "@config/firebase";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import ErrorMessage from "@components/ErrorMessage";
import { signIn } from 'next-auth/react';

export const LoginForm = ({ setResetPassword }) => {
  const router = useRouter();
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
            return router.push("/");
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

            <Button
              variant="link"
              type="button"
              onClick={() => setResetPassword(true)}
            >
              Forgot password?
            </Button>
          </Form>
        )}
      </Formik>
    </Section>
  );
};
