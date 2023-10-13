"use client";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/Dialog";
import Input from "@/components/Input";
import ProtectedItem from "@/components/ProtectedItem";
import { Section } from "@/components/Section";
import Textarea from "@/components/Textarea";
import * as DialogRadix from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Field, Form, Formik, FormikValues } from "formik";
import { observer } from "mobx-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useReferrals } from "./useReferrals";
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import ErrorMessage from "@/components/ErrorMessage";

const ReferralsPage = observer(() => {
  const queryClient = useQueryClient();
  const {
    referrals,
    page,
    increasePage,
    decreasePage,
    isPreviousData,
    hasMore,
  } = useReferrals();

  return (
    <ProtectedItem showNotFound>
      <Section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="text-6xl font-thin">Referrals</div>
        <SubmitReferral />
      </Section>
      <Section className="flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] table-auto text-center">
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
              {referrals?.map((referral) => (
                <tr
                  key={referral.email}
                  className="border-b dark:border-gray-500"
                >
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
        </div>
        <div className="flex w-full items-center justify-between py-8">
          <Button
            variant="link"
            onClick={() => decreasePage()}
            disabled={page === 1}
          >
            <ArrowLeftIcon className="h-8 w-8" />
          </Button>
          <span className="text-lg">{page}</span>
          <Button
            variant="link"
            onClick={() => increasePage()}
            disabled={isPreviousData || !hasMore}
          >
            <ArrowRightIcon className="h-8 w-8" />
          </Button>
        </div>
      </Section>
    </ProtectedItem>
  );
});

const SubmitReferral = () => {
  const queryClient = useQueryClient();
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
      trigger={
        <Button className="flex w-max items-center gap-2">
          <HeartIcon /> Submit Referral
        </Button>
      }
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
              queryClient.invalidateQueries({
                queryKey: ["referrals"],
              });
            })
            .catch((err: AxiosError) => {
              toast.error(`Failed to submit referral: ${err.message}`);
            });
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="space-y-4">
              <DialogRadix.Title className="col-span-2 flex items-center justify-between">
                <h1 className="text-3xl">Submit Referral</h1>
                <div className="col-span-2 flex space-x-2">
                  <Button type="submit">Refer</Button>

                  <DialogRadix.Close>
                    <Button variant="secondary">Cancel</Button>
                  </DialogRadix.Close>
                </div>
              </DialogRadix.Title>
              <div className="flex flex-col">
                <Field
                  as={Input}
                  label="Email"
                  name={`email`}
                  placeholder="daniel.korth@tum.de"
                  state={touched.email && errors.email && "error"}
                  type="text"
                  fullWidth
                />
                <ErrorMessage name={`email`} />
              </div>
              <div className="flex flex-col">
                <Field
                  as={Input}
                  label="First name"
                  name={`first_name`}
                  placeholder="Daniel"
                  type="text"
                  state={touched.first_name && errors.first_name && "error"}
                  fullWidth
                />
                <ErrorMessage name={`first_name`} />
              </div>
              <div className="flex flex-col">
                <Field
                  as={Input}
                  label="Last name"
                  name={`last_name`}
                  placeholder="Korth"
                  type="text"
                  state={touched.last_name && errors.last_name && "error"}
                  fullWidth
                />
                <ErrorMessage name={`last_name`} />
              </div>
              <div className="flex flex-col">
                <Field
                  as={Textarea}
                  label="Comment"
                  name={`comment`}
                  placeholder="Why is this person a good fit?"
                  state={touched.comment && errors.comment && "error"}
                  type="text"
                />
                <ErrorMessage name={`comment`} />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ReferralsPage;
