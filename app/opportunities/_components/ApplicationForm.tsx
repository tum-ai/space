"use client";
import React from "react";
import { type Application } from "@prisma/client";
import { ApplicationField } from "@components/application/applicationField";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { type Tally } from "@lib/types/tally";

interface ApplicationFormProps {
  application: Application;
}

const ApplicationForm = ({ application }: ApplicationFormProps) => {
  const form = useForm();
  const applicationFields = (application.content as Tally).data.fields;

  return (
    <Form {...form}>
      <div className="flex flex-col gap-12">
        {applicationFields
          .filter((field) => !!field.value)
          .map((field) => (
            <ApplicationField
              className="w-full"
              key={field.key}
              field={field}
            />
          ))}
      </div>
    </Form>
  );
};

export default ApplicationForm;
