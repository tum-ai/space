"use client";
import OpportunityCard from "./components/opportunityCard";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { Section } from "@components/Section";
import Link from "next/link";
import axios from "axios";

type Opportunity = {
  id: number;
  title: string;
  description: string;
  opportunityStart: number;
  opportunityEnd: number;
  participants: number;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export default function Main() {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunity')
      .then((res) => res.json())
      .then((opportunities) => {
        return Promise.all(opportunities.map((opp: Opportunity) => {
          return fetch(`/api/opportunity/${opp.id}/review`)
            .then(res => res.json())
            .then(reviews => {
              const participantsCount = reviews.length;
              const dateRange = `${formatDate(opp.opportunityStart)} - ${formatDate(opp.opportunityEnd)}`;
              return { ...opp, participants: participantsCount, date: dateRange };
            })
            .catch(error => {
              console.error('Error fetching reviews:', error);
              return { ...opp, participants: 0, date: `${formatDate(opp.opportunityStart)} - ${formatDate(opp.opportunityEnd)}` };
            });
        }));
      })
      .then((opportunitiesWithParticipants) => {
        setData(opportunitiesWithParticipants);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching opportunities:', error);
        setLoading(false);
      });
  }, []);
 
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: "Membership WS23/SS24",
      description:
        "Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.",
      date: "24/11/2024 - 24/01/2025",
      participants: 200,
    },
    {
      id: 2,
      title: "AI E-Lab",
      description:
        "Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.",
      date: "24/11/2024 - 24/01/2025",
      participants: 200,
    },
    {
      id: 3,
      title: "Random Event",
      description:
        "Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.",
      date: "24/11/2024 - 24/01/2025",
      participants: 200,
    },
  ]);

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h1 className="text-5xl font-thin">Opportunities</h1>
          <Link href={"./opportunities/create"}>
            <Button>Create Opportunity</Button>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {data?.map((item, index) => {
            return <OpportunityCard key={index} opportunity={item} />;
          })}
        </div>
      </div>
    </Section>
  );
}
