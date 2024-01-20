"use client";

import { Section } from "@components/Section";
import { Button } from "@components/ui/button";
import OverviewRows from "./components/OverviewRows";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import Input from "@components/Input";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
} from "@components/ui/dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";

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
  const opportunityId = decodeURIComponent(params.opportunity_id);
  const [phase, setPhase] = useState<"screening" | "interview" | "decision">(
    "screening",
  );

  return (
    <Section className="space-y-6">
      <OverviewHeader opportunityId={opportunityId} />
      <OverviewToolBar setPhase={setPhase} phase={phase} phases={ params.phases } />
      <OverviewRows data={data} />
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
        <h2 className="text-2xl">Winter Semester 2024/2025 Application</h2>
        <h2 className="text-2x">ID: {opportunityId}</h2>
      </div>
    </div>
  );
}

function OverviewToolBar({ phase, phases, setPhase }) {
  return (
    <div className="flex w-full flex-row space-x-2">
      <Input fullWidth placeholder="Search"></Input>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <MixerHorizontalIcon className="mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-50 w-56">
          <DropdownMenuLabel>Filter options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={phase}></DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
