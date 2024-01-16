"use client";

import { Section } from "@components/Section";
export default function Review({ params }) {
  const review_id = decodeURIComponent(params.review_id);

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-thin">Application: {review_id}</h1>
        </div>
      </div>
    </Section>
  );
}
