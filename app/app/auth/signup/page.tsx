"use client";
import { Button } from "@components/ui/button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import ErrorMessage from "@components/ErrorMessage";

const SignUp = () => {
  const router = useRouter();

  if(process.env.NEXT_PUBLIC_VERCEL_ENV !== 'development') {
    console.error('This page is only available in development mode!');
    router.push('/auth');
    return null; 
  }

  const registerUser = async (values) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
    })
    })

    if(response.ok) {
      router.push('/auth');
    } else {
      console.error('Something went wrong!');
    }
  };

  return (
    <Section>
    <Formik
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required(),
        password2: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required()
      })}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: "",
      }}
      onSubmit = {(values => registerUser(values))}
    >
      {({ errors, touched }) => (
        <Form className="m-auto flex max-w-[500px] flex-col gap-4">
          <h2 className="text-3xl">Sign Up</h2>
          <div>
            <Field
              as={Input}
              label="First name"
              type="firstName"
              name="firstName"
              placeholder=""
              state={touched.firstName && errors.firstName && "error"}
              fullWidth
            />
            <ErrorMessage name="firstName" />
          </div>
          <div>
            <Field
              as={Input}
              label="Last name"
              type="lastName"
              name="lastName"
              placeholder=""
              state={touched.lastName && errors.lastName && "error"}
              fullWidth
            />
            <ErrorMessage name="lastName" />
          </div>
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
            
          </div>
          <div>
            <Field
              as={Input}
              label="Confirm Password"
              type="password"
              name="password2"
              state={touched.password2 && errors.password2 && "error"}
              fullWidth
            />
          </div>
          <ErrorMessage name="password" />
          <ErrorMessage name="password2" />
          <hr className="col-span-2" />
          <Button type="submit">Sign Up</Button>
        </Form>
      )}
    </Formik>
  </Section>
  );
};

export default SignUp;
