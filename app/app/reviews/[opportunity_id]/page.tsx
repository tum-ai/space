"use client";

import { Section } from "@components/Section";
import { Button } from "@components/ui/button";
import OverviewRows from "./components/OverviewRows";
import OverviewTable from "./components/OverviewRows";
import {
  TableIcon,
  RowsIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import Input from "@components/Input";
import Link from "next/link";
import { useState } from "react";
import OpportunityCard from "app/opportunities/components/opportunityCard";

interface Reviewer {
  name: string;
  imgSrc: string;
}

let simon: Reviewer = {
  name: "Simon Huang",
  imgSrc: "https://placekitten.com/204/204",
};
let bryan: Reviewer = {
  name: "Bryan Alvin",
  imgSrc: "https://placekitten.com/201/201",
};
let tim: Reviewer = {
  name: "Tim Baum",
  imgSrc: "https://placekitten.com/203/203",
};

const data = {
  "1": {
    firstName: "Simon",
    lastName: "Huang",
    phase: "Interview",
    score: 9.8,
    reviewer: [simon, bryan],
  },
  "2": {
    firstName: "Tim",
    lastName: "Baum",
    phase: "Interview",
    score: 6.8,
    reviewer: [simon, tim],
  },
  "3": {
    firstName: "Bryan",
    lastName: "Alvin",
    phase: "Interview",
    score: 7.3,
    reviewer: [simon, tim, bryan],
  },
  "4": {
    firstName: "Peter",
    lastName: "Petersen",
    phase: "Interview",
    score: 7.3,
    reviewer: [simon, tim, bryan],
  },
  "5": {
    firstName: "Dieter",
    lastName: "Dietgen",
    phase: "Interview",
    score: 7.3,
    reviewer: [simon, tim, bryan],
  },
  "6": {
    firstName: "Magnus",
    lastName: "Magnusen",
    phase: "Interview",
    score: 7.3,
    reviewer: [simon, tim, bryan],
  },
};

export default function ReviewOverview({ params }) {
  const [tab, setTab] = useState<"rows" | "table">("rows");
  const opportunityId = decodeURIComponent(params.opportunity_id);
  return (
    <Section className="space-y-6">
      <OverviewHeader opportunityId={opportunityId} />
      <OverviewToolBar onTabChange={setTab} />
      {tab === "rows" ? (
        <OverviewRows data={data} />
      ) : (
        <OverviewTable data={data} />
      )}
    </Section>
  );
}

function OverviewHeader({ opportunityId }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-6xl font-thin">Applications</h1>
        <Link href="../opportunities">
          <Button>All opportunities</Button>
        </Link>
      </div>
      <p>View all available Applications for</p>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl">
          Winter Semester 2024/2025 Application
        </h2>
        <h2 className="text-2xl">
          ID: {opportunityId}
        </h2>
      </div>
    </div>
  );
}

function OverviewToolBar({ onTabChange }) {
  return (
    <div className="flex h-20 w-full flex-row space-x-2">
      <Input fullWidth placeholder="Search"></Input>
      <Button variant="outline" size="default">
        <MixerHorizontalIcon className="mr-2" />
        Filter
      </Button>
      <Tabs defaultValue="rows">
        <TabsList className="h-10">
          <TabsTrigger value="rows" onClick={() => onTabChange("rows")}>
            <RowsIcon />
          </TabsTrigger>
          <TabsTrigger value="table" onClick={() => onTabChange("table")}>
            <TableIcon />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
