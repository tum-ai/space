"use client";
import DetailedInfoCard from "./components/DetailedInfoCard";
import { AreaGraph } from "@components/Graph/AreaGraph";
import Select from "@components/Select";
import { useState } from "react";
import ClickableInfoCard from "./components/ClickableInfoCard";
import { PersonIcon } from "@radix-ui/react-icons";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Section } from "@components/Section";
import { fetchOpportunity } from "@services/opportunityService";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard({ params }) {
  const opportunityId = decodeURIComponent(params.opportunity_id);

  const { data: opportunity } = useQuery(["opportunity", opportunityId], () =>
    fetchOpportunity(opportunityId),
  );

  const [selectedPhase, setSelectedPhase] = useState("SCREENING");
  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-thin">{opportunity.title}</h1>
          <p>ID: {opportunityId}</p>
          <p className="mt-5 text-2xl">General Overview</p>

          <div className="grid grid-cols-3 gap-4">
            <DetailedInfoCard
              title="Total Applicants"
              data={420}
              growthInPercent={10}
            >
              <PersonIcon className="h-10 w-10" />
            </DetailedInfoCard>
            <DetailedInfoCard
              title="Total Applicants"
              data={420}
              growthInPercent={10}
            >
              <PersonIcon className="h-10 w-10" />
            </DetailedInfoCard>
            <DetailedInfoCard
              title="Total Applicants"
              data={420}
              growthInPercent={10}
            >
              <PersonIcon className="h-10 w-10" />
            </DetailedInfoCard>
          </div>

          <AreaGraph id={opportunityId} />

          <div className="flex flex-col gap-4">
            <p className="mt-5 text-2xl">Overview of phases</p>
            <div className="grid grid-cols-6 gap-4">
              <Select
                placeholder="From Type"
                options={[
                  {
                    key: "Screening",
                    value: "SCREENING",
                  },
                  {
                    key: "Interview",
                    value: "INTERVIEW",
                  },
                ]}
                value={selectedPhase}
                setSelectedItem={(item: string) => {
                  setSelectedPhase(item);
                }}
              />
              <Button className="col-start-6">Visit</Button>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1 flex flex-col gap-4">
                <ClickableInfoCard
                  data={30}
                  description={"Screeners"}
                  dark={true}
                />
                <ClickableInfoCard data={30} description={"Screeners"} />
              </div>
              <div className="col-span-5">
                <Card className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
