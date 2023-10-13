"use client";
import { ReviewFormComponent } from "./components/ReviewForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Application } from "@models/application";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { ApplicationOverview } from "app/review/components/applicationOverview";

const Review = ({ params }) => {
  const router = useRouter();
  const id = params.application_id;

  const goToNext = () => {
    const newId = (Number(id) + 1).toString();
    router.push(`./${newId}`);
  };

  const goToPrevious = () => {
    const newId = (Number(id) - 1).toString();
    router.push(`./${newId}`);
  };

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
        <NavigationButton onNext={goToNext} onPrev={goToPrevious} />
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
};

const NavigationButton = ({ onNext, onPrev }) => {
  return (
    <div className="absolute bottom-8 right-8 flex overflow-hidden rounded-md shadow-md">
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
