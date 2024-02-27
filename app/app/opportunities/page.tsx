"use client";
import OpportunityCard from "./components/opportunityCard";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import LoadingWheel from "@components/LoadingWheel";
import { fetchOpportunities } from "@services/opportunityService";
import { getReviewCounts } from "@services/reviewService";

export default function OpportunitiesPage() {
  const { data: opportunities, isLoading } = useQuery(
    ["opportunities"],
    fetchOpportunities,
  );

  const filteredOpportunities = opportunities?.filter(opportunity => opportunity.status !== 'MISSING_CONFIG');

  const ids = filteredOpportunities?.map((item) => item.id);

  const { data: applicationCounts } = useQuery(
    ["reviews/numbers"],
    () => getReviewCounts(ids),
    {
      enabled: !!ids,
    },
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

        <div className="grid grid-cols-3 gap-4">
          {filteredOpportunities?.map((item, index) => {
            return (
              <OpportunityCard
                opportunity={item}
                key={index}
                count={
                  applicationCounts?.find(
                    (count) => count.opportunityId === item.id,
                  ).count
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
