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
      <Card>
        <CardHeader>
          <CardTitle className="flex scroll-m-20 justify-between text-2xl font-semibold tracking-tight">
            Application Content
            <div className="flex gap-2">
              <Button asChild variant="secondary">
                <Link href={`${application.id - 1}`}>
                  <ChevronLeft />
                  Prev
                </Link>
              </Button>

              <Button asChild variant="secondary">
                <Link href={`${application.id + 1}`}>
                  Next
                  <ChevronRight />
                </Link>
              </Button>
            </div>
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
