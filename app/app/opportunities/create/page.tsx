"use client";

import GeneralInformation from "./components/GeneralInformation";
import DefineSteps from "./components/DefineSteps";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@components/ui/tabs";
import { Section } from "@components/Section";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "./schema";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod"

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
    id: 5,
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

const defaultValues = {
  generalInformation: {
    tallyID: '',
    name: '',
    begin: new Date(), // or a specific default date
    end: new Date(), // or a specific default date
    description: '',
    admins: [], // Assuming no default admins
    screeners: [], // Assuming no default screeners
  },
  defineSteps: {
    phases: {
      
    },
  },
};


export default function CreateOpportunity() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  })

  return (
    <Section>
      <Tabs defaultValue="general">
        <CreateOpportunityHeader />
        <Form {...form}>
          <TabsContent value="general">
            <GeneralInformation
              members={mockMembers}
              screeners={mockScreeners}
              admins={mockAdmins}
            />
          </TabsContent>
          <TabsContent value="steps">
            <DefineSteps />
          </TabsContent>
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
        <ArrowRightIcon className="h-5 w-5 mx-2"/>
        <TabsTrigger value="steps">Define steps</TabsTrigger>
      </TabsList>
    </div>
  );
}
