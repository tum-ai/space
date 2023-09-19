"use client";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import { auth } from "@config/firebase";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import ErrorMessage from "@components/ErrorMessage";

const Auth = observer(() => {
  const router = useRouter();
  const [openResetPassword, setOpenResetPassword] = useState(false);

  return (
    <>
      {!openResetPassword && (
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
            onSubmit={async (values) => {
              await toast.promise(
                signInWithEmailAndPassword(auth, values.email, values.password),
                {
                  loading: "Signing in",
                  success: "Welcome!",
                  error: "Failed to sign in",
                },
              );
              return router.push("/");
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
                  onClick={() => {
                    setOpenResetPassword(true);
                  }}
                >
                  Forgot password?
                </Button>
              </Form>
            )}
          </Formik>
        </Section>
      )}

      {openResetPassword && (
        <Section>
          <Formik
            validationSchema={Yup.object().shape({
              email: Yup.string().email().required(),
            })}
            initialValues={{
              email: "",
            }}
            onSubmit={(values) =>
              toast.promise(
                axios.post("/resetPassword?email=" + values.email),
                {
                  loading: "Sending password reset link",
                  success: "Successfully sent password reset link",
                  error: "Failed to send password reset link",
                },
              )
            }
          >
            {({ errors, touched }) => (
              <Form className="m-auto flex max-w-[500px] flex-col gap-4">
                <h2 className="text-3xl">Reset password</h2>
                <div>
                  <Field
                    as={Input}
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="daniel.korth@tum.de"
                    state={touched.email && errors.email && "error"}
                    fullWidth
                  />
                  <ErrorMessage name="email" />
                </div>
                <Button type="submit">Send link</Button>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    setOpenResetPassword(false);
                  }}
                >
                  Back to login
                </Button>
              </Form>
            )}
          </Formik>
        </Section>
      )}
    </>
  );
});

export default Auth;
