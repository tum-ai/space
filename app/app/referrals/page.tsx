"use client";
import { Button } from "@components/Button";
import Dialog from "@components/Dialog";
import Input from "@components/Input";
import { Section } from "@components/Section";
import Textarea from "@components/Textarea";
import { Referral } from "@models/referrals";
import { useStores } from "@providers/StoreProvider";
import * as DialogRadix from "@radix-ui/react-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import { observer } from "mobx-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const ReferralsPage = observer(() => {
  const queryClient = useQueryClient();
  const referralsQuery = useQuery({
    queryKey: ["referral"],
    queryFn: () =>
      axios
        .get("/application/referrals/")
        .then((res) => res.data.data as Referral[]),
  });

  return (
    <>
      <Section className="flex items-center justify-between">
        <div className="text-6xl font-thin">Referrals</div>
        <SubmitReferral />
      </Section>
      <Section className="flex overflow-auto">
        <table className="mx-auto w-full min-w-[800px] table-auto text-center">
          <thead>
            <tr className="border-b border-b-gray-400 dark:border-b-white">
              <th className="p-4">Email</th>
              <th className="p-4">First Name</th>
              <th className="p-4">Last Name</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {referralsQuery.data.map((referral) => (
              <tr key={referral.email}>
                <td>{referral.email}</td>
                <td>{referral.first_name}</td>
                <td>{referral.last_name}</td>
                <td>{referral.comment}</td>
                <td className="p-4">
                  <Button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this referral?",
                        )
                      ) {
                        axios
                          .delete(
                            `/application/referral/?email=${referral.email}`,
                          )
                          .then(() => {
                            queryClient.invalidateQueries({
                              queryKey: ["referrals"],
                            });
                            toast.success(
                              `Deleted referral for ${referral.email}`,
                            );
                          })
                          .catch((err: AxiosError) => {
                            toast.error(
                              `Failed to delete referral for ${referral.email}: ${err.message}`,
                            );
                          });
                      }
                    }}
                  >
                    delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
});

const SubmitReferral = () => {
  const [isOpen, setIsOpen] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Must be valid email")
      .required("Cannot be empty"),
    first_name: Yup.string().required("Cannot be empty"),
    last_name: Yup.string().required("Cannot be empty"),
    comment: Yup.string().required("Cannot be empty"),
  });

  const initialValues = {
    email: "",
    first_name: "",
    last_name: "",
    comment: "",
  };

  return (
    <Dialog
      isOpenOutside={isOpen}
      setIsOpenOutside={setIsOpen}
      trigger={<Button>submit referral</Button>}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values: FormikValues) => {
          await axios
            .post("/application/referral/", {
              data: values,
            })
            .then(() => {
              setIsOpen(false);
            })
            .catch((err: AxiosError) => {
              toast.error(`Failed to submit referral: ${err.message}`);
            });
        }}
      >
        {() => (
          <Form>
            <div className="space-y-4">
              <DialogRadix.Title className="col-span-2 flex items-center justify-between">
                <h1 className="text-3xl">Submit Referral</h1>
                <div className="col-span-2 flex space-x-2">
                  <Button type="submit">refer</Button>

                  <DialogRadix.Close>
                    <Button variant="secondary">cancel</Button>
                  </DialogRadix.Close>
                </div>
              </DialogRadix.Title>
              <div className="flex flex-col">
                <Field
                  as={Input}
                  label="Email"
                  name={`email`}
                  placeholder="daniel.korth@tum.de"
                  type="text"
                />
                <ErrorMessage
                  component="p"
                  className="text-red-500"
                  name={`email`}
                />
              </div>
              <div className="flex flex-col">
                <Field
                  as={Input}
                  label="First name"
                  name={`first_name`}
                  placeholder="Daniel"
                  type="text"
                />
                <ErrorMessage
                  component="p"
                  className="text-red-500"
                  name={`first_name`}
                />
              </div>
              <div className="flex flex-col">
                <Field
                  as={Input}
                  label="Last name"
                  name={`last_name`}
                  placeholder="Korth"
                  type="text"
                />
                <ErrorMessage
                  component="p"
                  className="text-red-500"
                  name={`last_name`}
                />
              </div>
              <div className="flex flex-col">
                <Field
                  as={Textarea}
                  label="Comment"
                  name={`comment`}
                  placeholder="Why is this person a good fit?"
                  type="text"
                />
                <ErrorMessage
                  component="p"
                  className="text-red-500"
                  name={`comment`}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ReferralsPage;
