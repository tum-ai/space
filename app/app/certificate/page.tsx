"use client";
import { Button } from "@components/Button";
import Input from "@components/Input";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Select from "@components/Select";
import axios, { AxiosError } from "axios";
import download from "downloadjs";
import { Field, Form, Formik, FormikValues } from "formik";
import { observer } from "mobx-react";
import toast from "react-hot-toast";

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
          {({ setFieldValue }) => (
            <Form className="grid-cols2 grid gap-4">
              <h2 className="text-2xl lg:col-span-2">Create Certificate</h2>
              <Field
                as={Select}
                placeholder={"Department"}
                data={departments.map((department) => ({
                  key: department,
                  value: department,
                }))}
                setSelectedItem={(item: string) => {
                  setFieldValue("DEPARTMENT", item);
                }}
              />
              <Field
                as={Select}
                placeholder={"Position"}
                data={positions.map((position) => ({
                  key: position,
                  value: position,
                }))}
                setSelectedItem={(position: string) => {
                  setFieldValue("TITLE", position);
                }}
              />
              <Field as={Input} label="First Name" type="text" name="NAME" />
              <Field as={Input} label="Last Name" type="text" name="LASTNAME" />
              <Field as={Input} label="Date Now" type="text" name="DATENOW" />
              <Field
                as={Input}
                label="Date Joined"
                type="text"
                name="DATEJOINED"
              />
              <Field
                as={Input}
                label="Pronoun (his/her)"
                type="text"
                name="PRONOUNPOS"
              />
              <Field
                as={Input}
                label="Date Signed On"
                type="text"
                name="SIGNED_ON"
              />
              <Field
                as={Input}
                label="Contribution 1"
                type="text"
                name="CONTRIB_1"
              />
              <Field
                as={Input}
                label="Contribution 2"
                type="text"
                name="CONTRIB_2"
              />
              <Field
                as={Input}
                label="Contribution 3"
                type="text"
                name="CONTRIB_3"
              />
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
