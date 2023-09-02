"use client";
import { Button } from "@components/Button";
import * as Yup from "yup";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikValues,
} from "formik";
import toast from "react-hot-toast";
import axios from "axios";

const Invite = () => {
  const schema = Yup.object().shape({
    invitees: Yup.array().of(
      Yup.object().shape({
        email: Yup.string()
          .email("Must be valid email")
          .required("Cannot be empty"),
        first_name: Yup.string().required("Cannot be empty"),
        last_name: Yup.string().required("Cannot be empty"),
        department_handle: Yup.string().required("Cannot be empty"),
        department_position: Yup.string().required("Cannot be empty"),
      }),
    ),
  });

  const initialValues = {
    invitees: [
      {
        email: "",
        first_name: "",
        last_name: "",
        department_handle: "DEV",
        department_position: "member",
      },
    ],
  };

  return (
    <ProtectedItem roles={["invite_members"]}>
      <Section>
        <h1 className="mb-8 text-6xl font-thin">Invite Members</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values: FormikValues) => {
            toast.promise(
              axios.post("/profiles/invite/members", {
                data: values.invitees,
              }),
              {
                loading: "Inviting new members",
                success: `Succesfully invited members`,
                error: "Failed to invite members",
              },
            );
          }}
        >
          {({ values }) => (
            <Form>
              <FieldArray name="invitees">
                {({ insert, remove, push }) => (
                  <div className="space-y-4">
                    {values.invitees.length > 0 &&
                      values.invitees.map((invitee, index) => (
                        <div className="flex items-start gap-4" key={index}>
                          <div className="flex flex-col">
                            <label htmlFor={`invitees.${index}.email`}>
                              Email
                            </label>
                            <Field
                              className="p-2"
                              name={`invitees.${index}.email`}
                              placeholder="daniel.korth@tum.de"
                              type="text"
                            />
                            <ErrorMessage name={`invitees.${index}.email`} />
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor={`invitees.${index}.first_name`}>
                              First name
                            </label>
                            <Field
                              className="p-2"
                              name={`invitees.${index}.first_name`}
                              placeholder="Daniel"
                              type="text"
                            />
                            <ErrorMessage name="First name" />
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor={`invitees.${index}.last_name`}>
                              Last name
                            </label>
                            <Field
                              className="p-2"
                              name={`invitees.${index}.last_name`}
                              placeholder="Korth"
                              type="text"
                            />
                            <ErrorMessage name="Last name" />
                          </div>

                          <div className="flex flex-col">
                            <label
                              htmlFor={`invitees.${index}.department_handle`}
                            >
                              Department handle
                            </label>
                            <Field
                              className="p-2"
                              name={`invitees.${index}.department_handle`}
                              as="select"
                            >
                              <option selected value="DEV">
                                Software Development
                              </option>
                              <option value="MARKETING">Marketing</option>
                              <option value="INDUSTRY">Industry</option>
                              <option value="MAKEATHON">Makeathon</option>
                              <option value="COMMUNITY">Community</option>
                              <option value="PNS">Partners and Sponsors</option>
                              <option value="LNF">Legal and Finance</option>
                              <option value="VENTURE">Venture</option>
                              <option value="EDUCATION">Education</option>
                              <option value="RND">
                                Research and Development
                              </option>
                            </Field>
                            <ErrorMessage name="Department handle" />
                          </div>

                          <div className="flex flex-col">
                            <label
                              htmlFor={`invitees.${index}.department_position`}
                            >
                              Department position
                            </label>
                            <Field
                              className="p-2"
                              name={`invitees.${index}.department_position`}
                              as="select"
                            >
                              <option selected value="member">
                                Member
                              </option>
                              <option value="teamlead">Teamlead</option>
                              <option value="president">President</option>
                              <option value="alumni">Alumni</option>
                            </Field>
                            <ErrorMessage
                              name={`invitees.${index}.department_position`}
                            />
                          </div>

                          {index !== 0 && (
                            <button
                              className="mt-4 p-2"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              <Cross1Icon className="h-6 w-6" />
                            </button>
                          )}
                        </div>
                      ))}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="flex items-center gap-2"
                        onClick={() =>
                          push({
                            email: "",
                            first_name: "",
                            last_name: "",
                            department_handle: "DEV",
                            department_position: "member",
                          })
                        }
                      >
                        <PlusIcon /> Add Invitation
                      </Button>

                      <Button type="submit">Invite</Button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </Section>
    </ProtectedItem>
  );
};

export default Invite;
