import axios from "axios";
import { Opportunity } from "@prisma/client";

export async function fetchOpportunities(): Promise<Opportunity[]> {
  const res = await axios.get("/api/opportunity");

  const opportunities: Opportunity[] = res.data.map(
    (opportunity: Opportunity) => {
      opportunity.opportunityStart = new Date(opportunity.opportunityStart);
      opportunity.opportunityEnd =
        opportunity.opportunityEnd && new Date(opportunity.opportunityEnd);
      return opportunity;
    },
  );

  return opportunities;
}

export async function fetchOpportunity(id: string): Promise<Opportunity> {
  const res = await axios.get(`/api/opportunity/${id}`);

  const opportunityStart = new Date(res.data.opportunityStart);
  const opportunityEnd =
    res.data.opportunityEnd && new Date(res.data.opportunityEnd);

  const opportunity: Opportunity = {
    opportunityStart,
    opportunityEnd,
    ...res.data,
  };

  return opportunity;
}
