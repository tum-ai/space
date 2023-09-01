"use client";
import { Button } from "@components/Button";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import axios from "axios";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikValues,
} from "formik";
import toast from "react-hot-toast";

const Invite = () => {
  const initialValues = {
    invitees: [
      {
        email: "",
        first_name: "",
        last_name: "",
        department_handle: "",
        department_position: "",
      },
    ],
  };

  return (
    <ProtectedItem roles={["invite_members"]}>
      <Section>
        <h1 className="mb-8 text-6xl font-thin">Invite Members</h1>

        <Formik
          initialValues={initialValues}
          onSubmit={(values: FormikValues) => {
            toast.promise(
              axios.post("/profiles/invite/members", {
                data: values.invitees,
              }),
              {
                loading: "",
                success: "",
                error: "",
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
                        <div className="flex gap-4" key={index}>
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
                            <ErrorMessage
                              name={`invitees.${index}.email`}
                              component="div"
                              className="field-error"
                            />
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
                            <ErrorMessage
                              name={`invitees.${index}.first_name`}
                              component="div"
                              className="field-error"
                            />
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
                            <ErrorMessage
                              name={`invitees.${index}.last_name`}
                              component="div"
                              className="field-error"
                            />
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
                              placeholder="Makethon"
                              type="text"
                            />
                            <ErrorMessage
                              name={`invitees.${index}.department_handle`}
                              component="div"
                              className="field-error"
                            />
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
                              placeholder="Teamlead"
                              type="text"
                            />
                            <ErrorMessage
                              name={`invitees.${index}.department_position`}
                              component="div"
                              className="field-error"
                            />
                          </div>

                          <div className="col">
                            <button type="button" onClick={() => remove(index)}>
                              <Cross1Icon className="mt-6 h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      ))}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="flex items-center gap-2"
                        onClick={() => push({ name: "", email: "" })}
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
