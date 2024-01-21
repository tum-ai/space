"use client";

import GeneralInformation from "./components/GeneralInformation";
import DefineSteps from "./components/DefineSteps";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@components/ui/tabs";
import { Section } from "@components/Section";

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

export default function CreateOpportunity() {
  return (
    <Section>
      <Tabs defaultValue="general">
        <CreateOpportunityHeader />
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
      </Tabs>
    </Section>
  );
}

function CreateOpportunityHeader({}) {
  return (
    <div className="flex flex-col mb-10 space-y-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-6xl">Opportunity</h1>
        <p>Configure a new opportunity</p>
      </div>
      <TabsList className="self-center">
        <TabsTrigger value="general">General information</TabsTrigger>
        <TabsTrigger value="steps">Define steps</TabsTrigger>
      </TabsList>
    </div>
  );
}
