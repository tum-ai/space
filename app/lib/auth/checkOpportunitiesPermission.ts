"use client";
import axios from "axios";
import Axios from "axios";
import { Opportunity, OpportunityParticipation } from "@prisma/client";
import { domainToASCII } from "url";
//import { env } from "app/env.mjs";

/*async function checkUsersCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!existingUser) {
    return false;
  }

  const passwordMatch = await compare(password, existingUser.password);

  return passwordMatch;
}*/

export async function checkOpportunityPermission(requiredRole: string[], userId: string, opportunityId: string) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!userId) {
    return false;
  }

  if(opportunityId == "all"){
    try {
      const opportunitiesResponse = await axios.get('/api/opportunities');
      const opportunities = opportunitiesResponse.data as Opportunity[];

      const opportunityParticipationPromises = opportunities.map(opportunity =>
        axios
        .get(`/api/opportunityParticipation/${opportunity.id}`)
        .then((res) => {
          const data = res.data as OpportunityParticipation[];
          return data.filter((op) => op.userId == userId ).map((op) => op.role);
        }));

      const response = await Promise.all(opportunityParticipationPromises);
      
      if (!response) {
        return false;
      }

      if (response.some((roles) => requiredRole.some((role) => roles.includes(role)))) {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false; // or handle the error as you see fit
    }

  }
  
  const response = await axios
    .get(`/api/opportunityParticipation/${opportunityId}`)
    .then((res) => {
        const data = res.data as OpportunityParticipation[];
        return data.filter((op) => op.userId == userId ).map((op) => op.role);
    })
    .catch((error) => {
      // console.error(error);
    });

  if (!response) {
    return false;
  }

  if (requiredRole.some((role) => response.includes(role))) {
    return true;
  }

  return false;
}
