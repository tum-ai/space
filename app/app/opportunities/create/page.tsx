"use client";

import GeneralInformation from "./components/GeneralInformation";
import DefineSteps from "./components/DefineSteps";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@components/ui/tabs";
import { Section } from "@components/Section";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FullFormSchema } from "./schema";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";

function submitOpportunity(values) {
  console.log(values);
}

const mockMembers = [
  {
    memberId: "1",
    memberName: "Simon Huang",
    tags: [
      { text: "Owner", color: "yellow" },
      { text: "Development", color: "blue" },
    ],
    photoUrl: "https://placekitten.com/200/200",
  },
  {
    memberId: "2",
    memberName: "Max von Storch",
    tags: [{ text: "RnD", color: "green" }],
    photoUrl: "https://placekitten.com/201/201",
  },
  {
    memberId: "3",
    memberName: "Tim Baum",
    tags: [{ text: "Legal and finance", color: "orange" }],
    photoUrl: "https://placekitten.com/202/202",
  },
];

const defaultSchemaValues = {
  generalInformation: {
    tallyID: "",
    name: "",
    begin: undefined,
    end: undefined,
    description: "",
    admins: [],
    screeners: [],
  },
  defineSteps: {
    phases: [],
  },
};

export default function CreateOpportunity() {
  const form = useForm<z.infer<typeof FullFormSchema>>({
    resolver: zodResolver(FullFormSchema),
    defaultValues: defaultSchemaValues,
  });

  return (
    <Section>
      <Tabs defaultValue="general">
        <CreateOpportunityHeader />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              console.log(values);
            })}
          >
            <TabsContent value="general">
              <GeneralInformation form={form} members={mockMembers} />
            </TabsContent>
            <TabsContent value="steps">
              <DefineSteps />
            </TabsContent>
            <Button
              variant="destructive"
              type="submit"
              className="mt-10 w-full"
            >
              Submit
            </Button>
          </form>
        </Form>
      </Tabs>
    </Section>
  );
}

function CreateOpportunityHeader({}) {
  return (
    <div className="mb-12 flex flex-col space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-6xl">Opportunity</h1>
        <p>Configure a new opportunity</p>
      </div>
      <TabsList className="self-center">
        <TabsTrigger value="general">General information</TabsTrigger>
        <ArrowRightIcon className="mx-2 h-5 w-5" />
        <TabsTrigger value="steps">Define steps</TabsTrigger>
      </TabsList>
    </div>
  );
}
