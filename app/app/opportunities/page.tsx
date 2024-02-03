"use client";
import OpportunityCard from "./components/opportunityCard";
import { useState } from "react";
import { Button } from "@components/ui/button";
import { Section } from "@components/Section";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Opportunity } from "@prisma/client";
import { is } from "date-fns/locale";
import LoadingWheel from "@components/LoadingWheel";
import { fetchOpportunities } from "../services/opportunityService";

export default function Main() {
  const { data, isLoading, isError, error } = useQuery(
    ["opportunities"],
    fetchOpportunities,
  );

  const opportunities: Opportunity[] = data?.data;

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h1 className="text-5xl font-thin">Opportunities</h1>
          <Link href={"./opportunities/create"}>
            <Button>Create Opportunity</Button>
          </Link>
        </div>
        {isLoading && <LoadingWheel />}
        <div className="grid grid-cols-3 gap-4">
          {opportunities?.map((item, index) => {
            return <OpportunityCard opportunity={item} key={index} />;
          })}
        </div>
      </div>
    </Section>
  );
}
