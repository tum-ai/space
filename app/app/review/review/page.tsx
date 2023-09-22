"use client";
import { useEffect, useState } from "react";
import { ReviewFormComponent } from "./_components/ReviewForm";
import { ApplicationOverview } from "../_components/applicationOverview";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Application } from "@models/application";
import { Section } from "@components/Section";
import { Button } from "@components/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

function Review() {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<number>(null);
  const id = useSearchParams().get("id");

  useEffect(() => {
    if (id) setCurrentId(Number(id));
  }, [id]);

  const goToNext = () => {
    const newId = currentId + 1;
    setCurrentId(newId);
    router.push(`/review/review?id=${newId}`, undefined);
  };

  const goToPrevious = () => {
    const newId = currentId - 1;
    setCurrentId(newId);
    router.push(`/review/review?id=${newId}`, undefined);
  };

  const query = useQuery({
    enabled: !!currentId,
    queryKey: ["application", currentId],
    queryFn: () =>
      axios
        .get(`/application/${currentId}`)
        .then((res) => res.data.data as Application),
  });

  if (!query.data || query.error) {
    return (
      <Section>
        <h1>{`Failed to load Application with id ${currentId}`}</h1>
      </Section>
    );
  }

  return (
    <Section className="relative grid gap-4 md:grid-cols-2">
      <ReviewFormComponent application={query.data} />
      <ApplicationOverview application={query.data} />
      <NavigationButton onNext={goToNext} onPrev={goToPrevious} />
    </Section>
  );
}

const NavigationButton = ({ onNext, onPrev }) => {
  return (
    <div className="absolute bottom-8 right-8 flex overflow-hidden rounded-md">
      <Button variant="default" onClick={onPrev} className="rounded-r-none">
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <div className="border-l-2 border-black dark:border-white"></div>
      <Button variant="default" onClick={onNext} className="rounded-l-none">
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Review;
