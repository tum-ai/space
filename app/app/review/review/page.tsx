"use client";
import { ReviewFormComponent } from "./_components/ReviewForm";
import { ApplicationOverview } from "../_components/applicationOverview";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Application } from "@models/application";
import { useSearchParams } from "next/navigation";
import { Section } from "@components/Section";

function Review() {
  const id = useSearchParams().get("id");
  const query = useQuery({
    enabled: !!id,
    queryKey: ["application", id],
    queryFn: () =>
      axios
        .get(`/application/${id}`)
        .then((res) => res.data.data as Application),
  });

  if (!query.data || query.error) {
    return (
      <Section>
        <h1>{`Failed to load Application with id ${id}`}</h1>
      </Section>
    );
  }

  return (
    <Section className="grid gap-4 md:grid-cols-2">
      <ReviewFormComponent application={query.data} />
      <ApplicationOverview application={query.data} />
    </Section>
  );
}

export default Review;
