"use client";
import OpportunityCard from "./_components/opportunityCard";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LoadingWheel from "@components/LoadingWheel";
import { fetchOpportunities } from "@services/opportunityService";

export default function OpportunitiesPage() {
  const { data: opportunities, isLoading } = useQuery(
    ["opportunities"],
    fetchOpportunities,
  );

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Opportunities
          </h1>
          <Link href={"./opportunities/create"}>
            <Button>Create Opportunity</Button>
          </Link>
        </div>

        {isLoading && <LoadingWheel />}

        <div className="grid auto-cols-max grid-flow-col gap-8">
          {opportunities?.map((item, index) => {
            return <OpportunityCard opportunity={item} key={index} count={0} />;
          })}
        </div>
      </div>
    </div>
  );
}
