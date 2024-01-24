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

let formatMemberSelect = (member) => ({
  key: member.memberName,
  value: member.memberId,
});

export default function GeneralInformation({ form, members }) {

  const membersSelectFormat = members.map((member) =>
    formatMemberSelect(member),
  );

  const [availableAdmins, setAvailableAdmins] = useState(membersSelectFormat);
  const [availableScreeners, setAvailableScreeners] =
    useState(membersSelectFormat);

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
    const member = members.find((m) => m.memberId === memberId);

    if (role === Roles.ADMIN) {
      appendAdmin({
        memberId: member.memberId,
        memberName: member.memberName,
        tags: member.tags,
        photoUrl: member.photoUrl,
      });
      setAvailableAdmins(availableAdmins.filter((m) => m.value !== memberId));
    } else if (role === Roles.SCREENER) {
      appendScreener({
        memberId: member.memberId,
        memberName: member.memberName,
        tags: member.tags,
        photoUrl: member.photoUrl,
      });
      setAvailableScreeners(
        availableScreeners.filter((m) => m.value !== memberId),
      );
    }

  }

  function handleRemoveMember(role, memberId, index) {
    const member = members.find((m) => m.memberId === memberId);

    if (role === Roles.ADMIN) {
      removeAdmin(index);
      setAvailableAdmins([...availableAdmins, formatMemberSelect(member)]);
    } else if (role === Roles.SCREENER) {
      removeScreener(index);
      setAvailableScreeners([
        ...availableScreeners,
        formatMemberSelect(member),
      ]);
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
        availableAdmins={availableAdmins}
        availableScreeners={availableScreeners}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
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

function MemberSection({
  screeners,
  admins,
  availableScreeners,
  availableAdmins,
  onAddMember,
  onRemoveMember,
  form,
}) {
  const [dialog, setDialog] = useState({ open: false, role: undefined });
  // type: {key: string -> memberName, value: string -> memberId}
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
        {stakeholder.members.map((member, index) => (
          <MemberBar
            key={member.memberId}
            name={member.memberName}
            photoUrl={member.photoUrl}
            tags={member.tags}
            onDelete={() =>
              onRemoveMember(stakeholder.role, member.memberId, index)
            }
          />
        ))}
        <AddMemberBar
          text={`+ Add ${stakeholder.role.toLowerCase()}`}
          onClick={() => {
            setSelectedMember(undefined);
            setDialog({ open: true, role: stakeholder.role });
          }}
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
              options={
                stakeholder.role === Roles.ADMIN
                  ? availableAdmins
                  : availableScreeners
              }
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
