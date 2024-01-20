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
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@components/ui/dropdown-menu";

interface Reviewer {
  name: string;
  imgSrc: string;
}

interface DataEntry {
  firstName: string;
  lastName: string;
  phase: string;
  score: number;
  reviewer: Reviewer[];
  finished: boolean;
}

type Data = { [key: string]: DataEntry };

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
    phase: "interview",
    score: 9.8,
    reviewer: [simon, bryan],
    finished: true,
  },
  "2": {
    firstName: "Tim",
    lastName: "Baum",
    phase: "interview",
    score: 6.8,
    reviewer: [simon, tim],
    finished: false,
  },
  "3": {
    firstName: "Bryan",
    lastName: "Alvin",
    phase: "interview",
    score: 7.3,
    reviewer: [simon, tim, bryan],
    finished: true,
  },
  "4": {
    firstName: "Peter",
    lastName: "Petersen",
    phase: "interview",
    score: 7.3,
    reviewer: [simon, tim, bryan],
    finished: false,
  },
  "5": {
    firstName: "Dieter",
    lastName: "Dietgen",
    phase: "screening",
    score: 7.3,
    reviewer: [simon, tim, bryan],
    finished: true,
  },
  "6": {
    firstName: "Magnus",
    lastName: "Magnusen",
    phase: "interview",
    score: 7.3,
    reviewer: [simon, tim, bryan],
    finished: false,
  },
};

function filterData(showOnlyUnfinished: boolean, phase: string, searchQuery: string, data: Data): Data {
  return Object.entries(data).reduce((acc, [key, item]) => {
    const isFinishedMatch = !showOnlyUnfinished || !item.finished;
    const isPhaseMatch = item.phase === phase || phase === "all";
    const isSearchMatch = item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          key.includes(searchQuery); // Include ID in the search

    if (isFinishedMatch && isPhaseMatch && isSearchMatch) {
      acc[key] = item;
    }
    return acc;
  }, {});
}

export default function ReviewOverview({ params }) {
  const opportunityId = decodeURIComponent(params.opportunity_id);
  const mockPhases = ["screening", "interview", "decision"]; // change -> needs to be passed
  const [phase, setPhase] = useState("all");
  const [showOnlyUnfinished, setShowOnlyUnfinished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = filterData(showOnlyUnfinished, phase, searchQuery, data);

  return (
    <Section className="space-y-6">
      <OverviewHeader opportunityId={opportunityId} />
      <OverviewToolBar
        setPhase={setPhase}
        phase={phase}
        phases={mockPhases}
        showOnlyUnfinished={showOnlyUnfinished}
        changeShowOnlyUnfinished={setShowOnlyUnfinished}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <OverviewRows data={filteredData} />
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

function OverviewToolBar({
  phase,
  phases,
  setPhase,
  showOnlyUnfinished,
  changeShowOnlyUnfinished,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="flex space-x-2">
      <Input fullWidth placeholder="Search for name or ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <MixerHorizontalIcon className="mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-50 w-56">
          <DropdownMenuLabel>Filter progress</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showOnlyUnfinished}
            onCheckedChange={changeShowOnlyUnfinished}
          >
            Only unfinished
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter phases</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={phase} onValueChange={setPhase}>
            {phases.map((phase) => (
              <DropdownMenuRadioItem value={phase} key={phase}>
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </DropdownMenuRadioItem>
            ))}
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
