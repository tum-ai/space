"use client";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import ErrorMessage from "@components/ErrorMessage";

export const PasswordReset = ({ setResetPassword }) => (
  <Section>
    <Formik
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(),
      })}
      initialValues={{
        email: "",
      }}
      onSubmit={(values) =>
        toast.promise(axios.post("/resetPassword?email=" + values.email), {
          loading: "Sending password reset link",
          success: "Successfully sent password reset link",
          error: "Failed to send password reset link",
        })
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
            onClick={() => setResetPassword(false)}
          >
            Back to login
          </Button>
        </Form>
      )}
    </Formik>
  </Section>
);
