"use client";
import React from "react";
import { Application } from "@prisma/client";
import { ApplicationField } from "@components/application/applicationField";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { Tally } from "@lib/types/tally";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ApplicationFormProps {
  application: Application;
}

const ApplicationForm = ({ application }: ApplicationFormProps) => {
  const form = useForm();
  const applicationFields = (application.content as Tally).data.fields;

  return (
    <Form {...form}>
      <Card className="h-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex scroll-m-20 justify-between text-2xl font-semibold tracking-tight">
            Application Content
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </Form>
  );
};

export default ApplicationForm;
