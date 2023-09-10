"use client";
import { useState } from "react";
import { Application, Review } from "@models/application";
import { Filter } from "util/types/filter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReviewTool = (page_size = 100) => {
  type Filters = Record<string, Filter<Application>>;
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["applications", page],
    queryFn: () =>
      axios
        .get("/applications/", { params: { page, page_size } })
        .then((res) => res.data.data as Application[]),
  });

  const increasePage = () => setPage((old) => old + 1);
  const decreasePage = () => setPage((old) => Math.max(old - 1, 1));

  const filterPredicate = (application: Application) =>
    Object.values(filters).every((filter: Filter<Application>) =>
      filter.predicate(application),
    );

  const searchFilter = (application: Application) =>
    search === "" || JSON.stringify(application).toLowerCase().includes(search);

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
    .filter(searchFilter)
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
    page,
    increasePage,
    decreasePage,
  };
};
