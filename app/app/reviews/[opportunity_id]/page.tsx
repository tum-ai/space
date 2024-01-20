"use client";

import { Section } from "@components/Section";
export default function Reviews({ params }) {
  const opportunityId = decodeURIComponent(params.opportunity_id);

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-thin">Applications</h1>
          <p>View all available applications</p>
          <p>ID: {opportunityId}</p>
        </div>
      </div>
    </Section>
  );
}
