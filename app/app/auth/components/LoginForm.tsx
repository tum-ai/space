"use client";
import { Button } from "@components/ui/button";
import { Section } from "@components/Section";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import { signIn } from "next-auth/react";
import { signOut } from 'next-auth/react';



export const LoginForm = async ({ setResetPassword }) => {
  const router = useRouter();

  const profileRoute = () => {
    router.push('/profile');
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
            return router.push("/");
          }
        }}
      >
        {({ errors, touched }) => (
          <Form className="m-auto flex max-w-[500px] flex-col gap-4 ">
            <h2 className="text-3xl flex justify-center">Login</h2>
            <hr className="col-span-2" />
            <Button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white" onClick={() => signIn('slack')}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png" alt="Slack logo" className="h-6 w-6 mr-2"/>
              Log in with Slack
            </Button>
            <Button onClick={() => signOut()}> Sign out</Button>
            <Button onClick={profileRoute}>View Profile</Button>
          </Form>
        )}
      </Formik>
    </Section>
  );
};
