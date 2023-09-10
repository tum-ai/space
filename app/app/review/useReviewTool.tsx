"use client";
import { useState } from "react";
import { Application, Review } from "@models/application";
import { Filter } from "util/types/filter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReviewTool = () => {
  type Filters = Record<string, Filter<Application>>;
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["applications"],
    queryFn: () =>
      axios.get("/applications/").then((res) => res.data.data as Application[]),
  });
  const filterPredicate = (application: Application) =>
    Object.values(filters).every((filter: Filter<Application>) =>
      filter.predicate(application),
    );

  const finalScoreComparator = (a: Application, b: Application): any => {
    const finalScoresA = a.reviews.map((review: Review) => review.finalscore);
    const finalScoresB = b.reviews.map((review: Review) => review.finalscore);
    const sumA = finalScoresA.reduce((a, b) => a + b, 0);
    const avgA = sumA / finalScoresA.length || 0;
    const sumB = finalScoresB.reduce((a, b) => a + b, 0);
    const avgB = sumB / finalScoresB.length || 0;
    return avgB - avgA;
  };

  const applications = query.data
    ?.filter(filterPredicate)
    .sort(finalScoreComparator);

  const getFormNames = () => {
    return [
      ...new Set(
        query.data?.map((application) => {
          return application.submission?.data?.formName;
        }),
      ),
    ];
  };

  return {
    applications,
    search,
    setSearch,
    filters,
    setFilters,
    isLoading: query.isLoading,
    error: query.error,
    getFormNames,
  };
};
