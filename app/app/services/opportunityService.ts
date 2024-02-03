import axios from "axios";

export async function fetchOpportunities() {
  const res = await axios.get("/api/opportunity");
  const opportunities: any[] = res.data;
  opportunities.forEach((opportunity) => {
    opportunity.opportunityStart = new Date(opportunity.opportunityStart);
    opportunity.opportunityEnd =
      opportunity.opportunityEnd && new Date(opportunity.opportunityEnd);
  });

  return res;
}
