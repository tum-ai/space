import DetailedInfoCard from "./components/DetailedInfoCard";
import ClickableInfoCard from "./components/ClickableInfoCard";
import { PersonIcon } from "@radix-ui/react-icons";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { AreaChart, Title } from "@tremor/react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import db from "server/db";

const AreaGraph = (props: { id: number }) => {
  const mockData = [
    {
      date: "Jan 22",
      "Applicants Processed": 10,
      "Total Applicants": 20,
    },
    {
      date: "Feb 22",
      "Applicants Processed": 15,
      "Total Applicants": 30,
    },
    {
      date: "Mar 22",
      "Applicants Processed": 19,
      "Total Applicants": 40,
    },
    {
      date: "Apr 22",
      "Applicants Processed": 30,
      "Total Applicants": 50,
    },
    {
      date: "May 22",
      "Applicants Processed": 45,
      "Total Applicants": 60,
    },
    {
      date: "Jun 22",
      "Applicants Processed": 50,
      "Total Applicants": 70,
    },
  ];

  return (
    <Card>
      <Title>Growth Data of ID: {props.id}</Title>
      <AreaChart
        className="mt-4 h-72"
        data={mockData}
        index="date"
        categories={["Applicants Processed", "Total Applicants"]}
        colors={["indigo", "cyan"]}
      />
    </Card>
  );
};

export default async function Dashboard({
  params,
}: {
  params: { opportunity_id: string };
}) {
  const opportunity = await db.opportunity.findUnique({
    where: { id: Number(params.opportunity_id) },
  });

  if (!opportunity) {
    return <div>Opportunity not found</div>;
  }

  const selectedPhase = "SCREENING";
  return (
    <section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-thin">{opportunity?.title}</h1>
          <p>ID: {opportunity.id}</p>
          <p className="mt-5 text-2xl">General Overview</p>

          <div className="grid grid-cols-3 gap-4">
            <DetailedInfoCard
              title="Total Applicants"
              data="420"
              growthInPercent={10}
            >
              <PersonIcon className="h-10 w-10" />
            </DetailedInfoCard>
            <DetailedInfoCard
              title="Total Applicants"
              data="420"
              growthInPercent={10}
            >
              <PersonIcon className="h-10 w-10" />
            </DetailedInfoCard>
            <DetailedInfoCard
              title="Total Applicants"
              data="420"
              growthInPercent={10}
            >
              <PersonIcon className="h-10 w-10" />
            </DetailedInfoCard>
          </div>

          <AreaGraph id={opportunity.id} />

          <div className="flex flex-col gap-4">
            <p className="mt-5 text-2xl">Overview of phases</p>
            <div className="grid grid-cols-6 gap-4">
              <Select value={selectedPhase}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="SCREENING">Screening</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="col-start-6">Visit</Button>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1 flex flex-col gap-4">
                <ClickableInfoCard data="30" description={"Screeners"} />
                <ClickableInfoCard data="30" description={"Screeners"} />
              </div>
              <div className="col-span-5">
                <Card className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
