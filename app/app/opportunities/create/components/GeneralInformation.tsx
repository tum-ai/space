import React, { useState } from "react";
import { Input } from "@components/ui/input";
import { Cross1Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import Select from "@components/Select";
import { MemberBar, AddMemberBar } from "./MemberBar";
import Dialog from "@components/Dialog";
import Tooltip from "@components/Tooltip";
import { DatePicker } from "@components/DatePicker";
import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { useFieldArray } from "react-hook-form";

enum Roles {
  ADMIN = "Admin",
  SCREENER = "Screener",
}

export default function GeneralInformation({ form, members }) {
  const {
    fields: adminFields,
    append: appendAdmin,
    remove: removeAdmin,
  } = useFieldArray({
    control: form.control,
    name: "generalInformation.admins",
  });

  const {
    fields: screenerFields,
    append: appendScreener,
    remove: removeScreener,
  } = useFieldArray({
    control: form.control,
    name: "generalInformation.screeners",
  });

  function handleAddMember(role, memberId) {
    const member = members.find((m) => m.value === memberId);
    if (role === Roles.ADMIN) {
      appendAdmin({ id: member.value, name: member.key, tags: [] });
    } else if (role === Roles.SCREENER) {
      appendScreener({ id: member.value, name: member.key, tags: [] });
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <FormInput
        name="generalInformation.tallyID"
        formControl={form.control}
        label="TallyID"
        placeholder="venture-campaign-ws-2023"
      />
      <FormInput
        name="generalInformation.name"
        formControl={form.control}
        label="Opportunity name"
        placeholder="Venture campaign WS2023"
      />
      <FormDatePicker
        formControl={form.control}
        name="generalInformation.begin"
        label="Begin"
      />
      <FormDatePicker
        formControl={form.control}
        name="generalInformation.end"
        label="End"
      />
      <div className="col-span-2 mb-8">
        <FormField
          control={form.control}
          name="generalInformation.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the opportunity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <MemberSection
        screeners={screenerFields}
        admins={adminFields}
        members={members}
        onAddMember={handleAddMember}
        form={form}
      />
    </div>
  );
}

function FormInput({ formControl, name, label, placeholder }) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function FormDatePicker({ formControl, name, label }) {
  return (
    <div className="col-span-2 flex-1 sm:col-span-1">
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <DatePicker
                placeholder="January 2nd, 2024"
                setValue={field.onChange}
                fullWidth
                value={field.value}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function MemberSection({ screeners, members, admins, onAddMember, form }) {
  const [dialog, setDialog] = useState({ open: false, role: undefined });
  const [selectedMember, setSelectedMember] = useState(undefined);

  function getAdminError() {
    const adminErrors = form.formState.errors.generalInformation?.admins;
    if (adminErrors && adminErrors.message) {
      return adminErrors.message;
    }
    return "";
  }

  const adminErrorMessage = getAdminError();

  function submitAddMember() {
    if (selectedMember && dialog.role) {
      onAddMember(dialog.role, selectedMember);
    }
    setDialog({ open: false, role: undefined });
    setSelectedMember(undefined);
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

  return stakeholders.map((stakeholder) => (
    <div
      key={stakeholder.role}
      className="col-span-2 flex flex-1 flex-col lg:col-span-1"
    >
      <div className="mb-2 flex items-center gap-2">
        <h1 className="text-2xl">{stakeholder.title}</h1>
        <Tooltip trigger={<QuestionMarkCircledIcon />}>
          {stakeholder.hint}
        </Tooltip>
      </div>
      <div className="flex flex-col gap-2">
        {stakeholder.members.map((member) => (
          <MemberBar
            key={member.id}
            name={member.name}
            photoUrl={member.photoUrl}
            tags={member.tags}
            onDelete={() => console.log("delete member", member.id)}
          />
        ))}
        <AddMemberBar
          text={`+ Add ${stakeholder.role.toLowerCase()}`}
          onClick={() => setDialog({ open: true, role: stakeholder.role })}
        />
        <Dialog
          isOpenOutside={dialog.open && dialog.role === stakeholder.role}
          setIsOpenOutside={(open) =>
            setDialog({ open, role: stakeholder.role })
          }
          trigger={null}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">
                Add {dialog.role?.toLowerCase()} to this opportunity
              </h2>
              <Cross1Icon
                className="cursor-pointer text-gray-400"
                onClick={() => setDialog({ open: false, role: undefined })}
              />
            </div>
            <Select
              placeholder="Select a member"
              options={members}
              value={selectedMember}
              setSelectedItem={setSelectedMember}
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
      {stakeholder.role === Roles.ADMIN && adminErrorMessage && (
        <FormMessage className="mt-2">{adminErrorMessage}</FormMessage>
      )}
    </div>
  ));
}
