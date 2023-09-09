"use client";
import { Button } from "@components/Button";
import Input from "@components/Input";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Select from "@components/Select";
import axios, { AxiosError } from "axios";
import download from "downloadjs";
import { Field, Form, Formik, FormikValues } from "formik";
import ErrorMessage from "@components/ErrorMessage";
import { observer } from "mobx-react";
import toast from "react-hot-toast";
import * as Yup from "yup";

function Certificate() {
  const departments = [
    "Software Development (DEV)",
    "Marketing",
    "Industry",
    "Makeathon",
    "Community",
    "Partners & Sponsors (PnS)",
    "Legal & Finance (LnF)",
    "Venture",
    "Education",
    "Research & Development (RnD)",
  ];

  const positions = ["member", "teamlead", "advisor"];

  const validationSchema = Yup.object().shape({
    DEPARTMENT: Yup.string().required(),
    TITLE: Yup.string().required(),
    NAME: Yup.string().required(),
    LASTNAME: Yup.string().required(),
    DATENOW: Yup.string().required(),
    DATEJOINED: Yup.string().required(),
    PRONOUNPOS: Yup.string().required(),
    SIGNED_ON: Yup.string().required(),
    CONTRIB_1: Yup.string().required(),
    CONTRIB_2: Yup.string().required(),
    CONTRIB_3: Yup.string().required(),
  });

  // TODO choose member's name from member profiles directly and fill in information accordingly
  const initialValues = {
    DEPARTMENT: "",
    TITLE: "",
    NAME: "",
    LASTNAME: "",
    DATENOW: "",
    DATEJOINED: "",
    PRONOUNPOS: "",
    SIGNED_ON: "",
    CONTRIB_1: "",
    CONTRIB_2: "",
    CONTRIB_3: "",
  };

  return (
    <ProtectedItem showNotFound roles={["create_certificate"]}>
      <Section>
        <div className="text-6xl font-thin">Member Certificate</div>
      </Section>
      <Section className="">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values: FormikValues) => {
            const response = await axios
              .post(
                "/certificate/membership/",
                { data: values },
                { responseType: "blob" },
              )
              .then((res) => res)
              .catch((err: AxiosError) => {
                toast.error(`Failed to generate certificate: ${err.message}`);
              });

            if (response) {
              let fileName = `tumai-certificate-${values.NAME}-${values.LASTNAME}.pdf`;
              download(
                response.data,
                fileName,
                response.headers["content-type"],
              );
            }
          }}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="grid-cols2 grid gap-4">
              <h2 className="text-2xl lg:col-span-2">Create Certificate</h2>
              <div>
                <Field
                  as={Select}
                  label="Department"
                  name="DEPARTMENT"
                  placeholder={"Department"}
                  data={departments.map((department) => ({
                    key: department,
                    value: department,
                  }))}
                  setSelectedItem={(item: string) => {
                    setFieldValue("DEPARTMENT", item);
                  }}
                />
                <ErrorMessage name="DEPARTMENT" />
              </div>
              <div>
                <Field
                  as={Select}
                  label="Position"
                  name="TITLE"
                  placeholder={"Position"}
                  data={positions.map((position) => ({
                    key: position,
                    value: position,
                  }))}
                  setSelectedItem={(position: string) => {
                    setFieldValue("TITLE", position);
                  }}
                />
                <ErrorMessage name="DEPARTMENT" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="First Name"
                  type="text"
                  name="NAME"
                  state={touched.NAME && errors.NAME && "error"}
                />
                <ErrorMessage name="NAME" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Last Name"
                  type="text"
                  name="LASTNAME"
                  state={touched.LASTNAME && errors.LASTNAME && "error"}
                />
                <ErrorMessage name="LASTNAME" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Date Now"
                  type="text"
                  name="DATENOW"
                  state={touched.DATENOW && errors.DATENOW && "error"}
                />
                <ErrorMessage name="DATENOW" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Date Joined"
                  type="text"
                  name="DATEJOINED"
                  state={touched.DATEJOINED && errors.DATEJOINED && "error"}
                />
                <ErrorMessage name="DATEJOINED" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Pronoun (his/her)"
                  type="text"
                  name="PRONOUNPOS"
                  state={touched.PRONOUNPOS && errors.PRONOUNPOS && "error"}
                />
                <ErrorMessage name="PRONOUNPOS" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Date Signed On"
                  type="text"
                  name="SIGNED_ON"
                  state={touched.SIGNED_ON && errors.SIGNED_ON && "error"}
                />
                <ErrorMessage name="SIGNED_ON" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Contribution 1"
                  type="text"
                  name="CONTRIB_1"
                  state={touched.CONTRIB_1 && errors.CONTRIB_1 && "error"}
                />
                <ErrorMessage name="CONTRIB_1" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Contribution 2"
                  type="text"
                  name="CONTRIB_2"
                  state={touched.CONTRIB_2 && errors.CONTRIB_2 && "error"}
                />
                <ErrorMessage name="CONTRIB_2" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Contribution 3"
                  type="text"
                  name="CONTRIB_3"
                  state={touched.CONTRIB_3 && errors.CONTRIB_3 && "error"}
                />
                <ErrorMessage name="CONTRIB_3" />
              </div>
              <Button className="lg:col-span-2" type="submit">
                save
              </Button>
            </Form>
          )}
        </Formik>
      </Section>
    </ProtectedItem>
  );
}

export default observer(Certificate);
