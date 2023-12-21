"use client";

import Input from "@components/Input";
import { Button } from "@components/ui/button";
import { Cross1Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import Select from "@components/Select";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MemberBar, AddMemberBar } from "../components/MemberBar";
import Dialog from "@components/Dialog";
import { useState } from "react";
import ErrorMessage from "@components/ErrorMessage";
import Textarea from "@components/Textarea";
import Tooltip from "@components/Tooltip";

const mockAdmins = [
  {
    id: 1,
    photoUrl: "https://placekitten.com/200/200",
    name: "Simon Huang",
    tags: [
      { text: "Owner", color: "yellow" },
      { text: "Development", color: "blue" },
    ],
  },
  {
    id: 2,
    photoUrl: "https://placekitten.com/201/201",
    name: "Max von Storch",
    tags: [{ text: "RnD", color: "green" }],
  },
];

const mockScreeners = [
  {
    id: 3,
    photoUrl: "https://placekitten.com/202/202",
    name: "Emma Johnson",
    tags: [{ text: "Legal and finance", color: "orange" }],
  },
  {
    id: 4,
    photoUrl: "https://placekitten.com/204/204",
    name: "Oliver Davis",
    tags: [{ text: "Community", color: "red" }],
  },
  {
    photoUrl: "https://placekitten.com/206/206",
    name: "Sophia Rodriguez",
    tags: [{ text: "Development", color: "purple" }],
  },
];

const mockMembers = [
  {
    key: "Simon Huang",
    value: "1",
  },
  {
    key: "Tim Baum",
    value: "2",
  },
];

enum Roles {
  ADMIN = "Admin",
  SCREENER = "Screener",
}

export default function CreateOpportunity() {
  return (
    // center element
    <div className="mx-0 mx-4 mb-12 flex flex-col gap-8 self-center md:mx-24">
      <div className="flex flex-col gap-3">
        <h1 className="text-6xl">Opportunity</h1>
        <p>Configure a new opportunity</p>
      </div>
      {/* TODO: Create placeholder logic */}
      <div className="text-lg">General information {"->"} Define steps</div>
      {/* Setup form */}
      <Formik
        validationSchema={Yup.object().shape({
          tallyId: Yup.string(),
          name: Yup.string().required(),
          begin: Yup.date().required(),
          end: Yup.date(),
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
        {({ errors, touched }) => (
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
                <Field
                  as={Input}
                  label="Begin"
                  name="begin"
                  type="date"
                  placeholder="Pick a date"
                  state={touched.begin && errors.begin && "error"}
                  fullWidth
                />
                <ErrorMessage name="begin" />
              </div>
              <div className="flex-1">
                <Field
                  as={Input}
                  label="End"
                  name="end"
                  type="date"
                  placeholder="Pick a date"
                  state={touched.end && errors.end && "error"}
                  fullWidth
                />
              </div>
              <ErrorMessage name="end" />
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

            <MemberSection />

            <div className="grid w-full">
              <Button className="justify-self-end" type="submit">
                Next
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function MemberSection() {
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
      members: mockAdmins,
      role: Roles.ADMIN,
      hint: "Admins can edit opportunities",
    },
    {
      title: "Screeners",
      members: mockScreeners,
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
                    options={mockMembers}
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
