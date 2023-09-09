"use client";
import { Button } from "@components/Button";
import Input from "@components/Input";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Select from "@components/Select";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import axios, { AxiosError } from "axios";
import { Field, FieldArray, Form, Formik, FormikValues } from "formik";
import ErrorMessage from "@components/ErrorMessage";
import toast from "react-hot-toast";
import * as Yup from "yup";

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

  const departments = {
    "Software Development": "DEV",
    Industry: "INDUSTRY",
    Makeathon: "MAKEATHON",
    Marketing: "MARKETING",
    Community: "COMMUNITY",
    "Partners and Sponsors": "PNS",
    "Legal and Finance": "LNF",
    Venture: "VENTURE",
    Education: "EDUCATION",
    "Research and Development": "RND",
  };
  const positions = {
    President: "president",
    Member: "member",
    Teamlead: "teamlead",
    Alumni: "alumni",
  };

  return (
    <ProtectedItem roles={["invite_members"]}>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values: FormikValues) => {
          const data = await axios
            .post("/profiles/invite/members", {
              data: values.invitees,
            })
            .then((res) => {
              return res.data;
            })
            .catch((err: AxiosError) => {
              toast.error(`Failed to invite: ${err.message}`);
            });
          if (data["failed"].length) {
            const message = data["failed"].map(
              (failedAccount) =>
                `${failedAccount["data"]["email"]}: ${failedAccount["error"]}\n`,
            );
            toast.error(message);
          }
          if (data["succeeded"].length) {
            toast.success(
              `${data["succeeded"].length} Users successfully invited`,
            );
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <FieldArray name="invitees">
              {({ remove, push }) => (
                <>
                  <Section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h1 className="text-6xl font-thin">Invite Members</h1>
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
                  </Section>
                  <Section className="overflow-x-auto">
                    <table className="w-full min-w-[50rem] text-left">
                      <thead>
                        <tr className="grid grid-cols-[repeat(5,_1fr)_3rem] gap-1">
                          <th>Email</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Department</th>
                          <th>Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.invitees.length > 0 &&
                          values.invitees.map(
                            (invitee: string, index: number) => (
                              <tr
                                className="my-1 grid grid-cols-[repeat(5,_1fr)_3rem] gap-1"
                                key={`invitee-${index}`}
                              >
                                <td>
                                  <Field
                                    as={Input}
                                    name={`invitees.${index}.email`}
                                    placeholder="daniel.korth@tum.de"
                                    type="text"
                                    fullWidth
                                  />
                                  <ErrorMessage
                                    name={`invitees.${index}.email`}
                                  />
                                </td>
                                <td>
                                  <Field
                                    as={Input}
                                    name={`invitees.${index}.first_name`}
                                    placeholder="Daniel"
                                    type="text"
                                    fullWidth
                                  />
                                  <ErrorMessage
                                    name={`invitees.${index}.first_name`}
                                  />
                                </td>
                                <td>
                                  <Field
                                    as={Input}
                                    name={`invitees.${index}.last_name`}
                                    placeholder="Korth"
                                    type="text"
                                    fullWidth
                                  />
                                  <ErrorMessage
                                    name={`invitees.${index}.last_name`}
                                  />
                                </td>
                                <td>
                                  <Field
                                    name={`invitees.${index}.department_handle`}
                                    as={Select}
                                    placeholder={"Department"}
                                    options={Object.entries(departments).map(
                                      ([key, value]) => ({
                                        key: key,
                                        value: value,
                                      }),
                                    )}
                                    selectedItem={{
                                      key: departments[
                                        invitee["department_handle"]
                                      ],
                                      value: invitee["department_handle"],
                                    }}
                                    setSelectedItem={(value) => {
                                      setFieldValue(
                                        `invitees.${index}.department_handle`,
                                        value,
                                      );
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`invitees.${index}.department_handle`}
                                  />
                                </td>
                                <td>
                                  <Field
                                    as={Select}
                                    name={`invitees.${index}.department_position`}
                                    placeholder={"Position"}
                                    options={Object.entries(positions).map(
                                      ([key, value]) => ({
                                        key: key,
                                        value: value,
                                      }),
                                    )}
                                    selectedItem={{
                                      key: positions[
                                        invitee["department_position"]
                                      ],
                                      value: invitee["department_position"],
                                    }}
                                    setSelectedItem={(value) => {
                                      setFieldValue(
                                        `invitees.${index}.department_position`,
                                        value,
                                      );
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`invitees.${index}.department_position`}
                                  />
                                </td>
                                {index !== 0 && (
                                  <button
                                    className="mt-1 p-2"
                                    type="button"
                                    onClick={() => remove(index)}
                                  >
                                    <Cross1Icon className="h-6 w-6" />
                                  </button>
                                )}
                              </tr>
                            ),
                          )}
                      </tbody>
                    </table>
                  </Section>
                </>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </ProtectedItem>
  );
};

export default Invite;
