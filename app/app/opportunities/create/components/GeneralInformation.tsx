"use client";

import Input from "@components/Input";
import { Button } from "@components/ui/button";
import { Cross1Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import Select from "@components/Select";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MemberBar, AddMemberBar } from "./MemberBar";
import Dialog from "@components/Dialog";
import { useState } from "react";
import ErrorMessage from "@components/ErrorMessage";
import Textarea from "@components/Textarea";
import Tooltip from "@components/Tooltip";
import { DatePicker } from "@components/DatePicker";

enum Roles {
  ADMIN = "Admin",
  SCREENER = "Screener",
}

export default function GeneralInformation({ members, screeners, admins }) {
  return (
    // center element
    <Formik
      validationSchema={Yup.object().shape({
        tallyId: Yup.string(),
        name: Yup.string().required(),
        begin: Yup.date().required(),
        end: Yup.date().test(
          "is-greater",
          "End date must be later than begin date",
          function (value) {
            const beginDate = this.parent.begin;
            if (!value || !beginDate) return true;
            return value >= beginDate;
          },
        ),
        description: Yup.string(),
      })}
      initialValues={{
        tallyId: undefined,
        name: undefined,
        begin: undefined,
        end: undefined,
        description: undefined,
      }}
      onSubmit={async (values) => {
        console.log(values); //TODO: actually submit via API
      }}
    >
      {({ errors, touched, setValues, values }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              as={Input}
              label="Tally ID"
              name="tallyId"
              placeholder="venture-campaign-ws-2023"
              state={touched.tallyId && errors.tallyId && "error"}
              fullWidth
            />
            <ErrorMessage name="tallyId" />
          </div>
          <div>
            <Field
              as={Input}
              label="Opportunity name"
              name="name"
              placeholder="Venture campaign WS2023"
              state={touched.name && errors.name && "error"}
              fullWidth
            />
            <ErrorMessage name="name" />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <DatePicker
                label="Begin"
                placeholder="Pick a date"
                state={(touched.begin && errors.begin && "error") || "default"}
                fullWidth
                value={values.begin}
                setValue={(value: Date) =>
                  setValues({ ...values, begin: value })
                }
              />
              <ErrorMessage name="begin" />
            </div>
            <div className="flex-1">
              <DatePicker
                label="End"
                placeholder="Pick a date"
                state={(touched.begin && errors.begin && "error") || "default"}
                fullWidth
                value={values.end}
                setValue={(value: Date) => setValues({ ...values, end: value })}
              />
              <ErrorMessage name="end" />
            </div>
          </div>
          <div>
            <Field
              as={Textarea}
              label="Description"
              variant="outlined"
              name="description"
              placeholder="Venture campaign for the winter semester 2023 in partnership with OpenAI."
              state={touched.description && errors.description && "error"}
              fullWidth
            />
            <ErrorMessage name="description" />
          </div>
          <hr className="col-span-2" />

          <MemberSection
            screeners={screeners}
            members={members}
            admins={admins}
          />
        </Form>
      )}
    </Formik>
  );
}

function MemberSection({ screeners, members, admins }) {
  const [dialog, setDialog] = useState({ open: false, role: undefined } as {
    open: boolean;
    role: Roles | undefined;
  });

  const [selectedMember, setSelectedMember] = useState(
    undefined as string | undefined,
  );

  function submitAddMember() {
    setDialog({ open: false, role: undefined });
    setSelectedMember(undefined);
    //TODO: Add member to list via API
  }

  const stakeholders = [
    {
      title: "Admins",
      members: admins,
      role: Roles.ADMIN,
      hint: "Admins can edit opportunities",
    },
    {
      title: "Screeners",
      members: screeners,
      role: Roles.SCREENER,
      hint: "Screeners evaluate incoming applications",
    },
  ];

  return (
    <div className="md :flex-row flex flex-col  gap-8">
      {stakeholders.map((stakeholder) => {
        return (
          <div key={stakeholder.role} className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-2xl">{stakeholder.role}s</h1>
              <Tooltip trigger={<QuestionMarkCircledIcon />}>
                {stakeholder.hint}
              </Tooltip>
            </div>
            <div className="flex flex-col gap-2">
              {stakeholder.members.map((member) => {
                return (
                  <MemberBar
                    key={member.id}
                    name={member.name}
                    photoUrl={member.photoUrl}
                    tags={member.tags}
                    onDelete={() => console.log("delete me" + member.id)}
                  />
                );
              })}
              <Dialog
                isOpenOutside={dialog.open}
                setIsOpenOutside={() =>
                  setDialog({ open: true, role: stakeholder.role })
                }
                trigger={
                  <AddMemberBar
                    text={`+ Add ${stakeholder.role.toLowerCase()}`}
                    onClick={() => console.log("add me")}
                  />
                }
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg">
                      Add {dialog.role?.toLowerCase()} to this opportunity
                    </h2>
                    <Cross1Icon
                      className="cursor-pointer text-gray-400"
                      onClick={() =>
                        setDialog({ open: false, role: undefined })
                      }
                    />
                  </div>
                  <Select
                    placeholder="Select a member"
                    options={members}
                    value={selectedMember}
                    setSelectedItem={(item: string) => {
                      setSelectedMember(item);
                    }}
                  />
                </div>
                <div className="mt-4 grid w-full">
                  <Button
                    disabled={!selectedMember}
                    className="justify-self-end"
                    onClick={submitAddMember}
                  >
                    Add
                  </Button>
                </div>
              </Dialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}
