"use client";
import { Button } from "@/components/Button";
import Input from "@/components/Input";
import ProtectedItem from "@/components/ProtectedItem";
import { Section } from "@/components/Section";
import Select from "@/components/Select";
import axios, { AxiosError } from "axios";
import download from "downloadjs";
import { Field, Form, Formik, FormikValues } from "formik";
import ErrorMessage from "@/components/ErrorMessage";
import { observer } from "mobx-react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { DownloadIcon } from "@radix-ui/react-icons";

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
    SIGNED_ON: "",
    CONTRIB_1: "",
    CONTRIB_2: "",
    CONTRIB_3: "",
  };

  return (
    <ProtectedItem showNotFound roles={["create_certificate"]}>
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
            download(response.data, fileName, response.headers["content-type"]);
          }
        }}
      >
        {({ setFieldValue, errors, touched }) => (
          <Section>
            <Form>
              <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-6xl font-thin">Member Certificate</h1>
                <Button className="flex w-max items-center gap-2" type="submit">
                  <DownloadIcon />
                  Save Certificate
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field
                    as={Select}
                    label="Department"
                    name="DEPARTMENT"
                    placeholder={"Department"}
                    options={departments.map((department) => ({
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
                    options={positions.map((position) => ({
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
                    placeholder="Daniel"
                    type="text"
                    name="NAME"
                    state={touched.NAME && errors.NAME && "error"}
                    fullWidth
                  />
                  <ErrorMessage name="NAME" />
                </div>
                <div>
                  <Field
                    as={Input}
                    label="Last Name"
                    placeholder="Korth"
                    type="text"
                    name="LASTNAME"
                    state={touched.LASTNAME && errors.LASTNAME && "error"}
                    fullWidth
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
                    fullWidth
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
                    fullWidth
                  />
                  <ErrorMessage name="DATEJOINED" />
                </div>
                <div>
                  <Field
                    as={Input}
                    label="Date Signed On"
                    type="text"
                    name="SIGNED_ON"
                    state={touched.SIGNED_ON && errors.SIGNED_ON && "error"}
                    fullWidth
                  />
                  <ErrorMessage name="SIGNED_ON" />
                </div>
                <div className="col-span-2 flex flex-col gap-4">
                  <div>
                    <Field
                      as={Input}
                      label="Contribution 1"
                      type="text"
                      name="CONTRIB_1"
                      state={touched.CONTRIB_1 && errors.CONTRIB_1 && "error"}
                      fullWidth
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
                      fullWidth
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
                      fullWidth
                    />
                    <ErrorMessage name="CONTRIB_3" />
                  </div>
                </div>
              </div>
            </Form>
          </Section>
        )}
      </Formik>
    </ProtectedItem>
  );
}

export default observer(Certificate);
