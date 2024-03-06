"use client";
import React from "react";
import { Application } from "@prisma/client";
import { ApplicationField } from "@components/application/applicationField";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { Tally } from "@lib/types/tally";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

interface ApplicationFormProps {
  application: Application;
}

const ApplicationForm = ({ application }: ApplicationFormProps) => {
  const form = useForm();
  const applicationFields = (application.content as Tally).data.fields;

  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Application
            </h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-12">
            {applicationFields
              .filter((field) => !!field.value)
              .map((field) => (
                <ApplicationField key={field.key} field={field} />
              ))}
          </div>
        </CardContent>
      </Card>
    </Form>
  );
};

export default ApplicationForm;
