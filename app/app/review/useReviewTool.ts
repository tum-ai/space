"use client";
import { useState } from "react";
import { Application } from "@models/application";
import { Filter } from "util/types/filter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Review } from "@models/review";

export const useReviewTool = (page_size = 100) => {
  type Filters = Record<string, Filter<Application>>;
  const [serverSearching, setServerSearching] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");

  const updateFilter = (filterName: string, value: string) => {
    setFilters((old) => ({
      ...old,
      [filterName]: {
        name: value,
        predicate: (application) =>
          application.submission.data.formName === value,
      },
    }));
  };

  const [page, setPage] = useState(1);

  const infoQuery = useQuery({
    queryKey: ["applications/info"],
    queryFn: () =>
      axios
        .get("/applications/info")
        .then((res) => res.data.data as string[])
        .then((formNames) => {
          updateFilter("formName", formNames.at(0));
          return formNames;
        }),
  });

  const query = useQuery({
    queryKey: ["applications", page, serverSearching && search, filters],
    queryFn: () =>
      axios
        .get("/applications/", {
          params: {
            page,
            page_size,
            form_type: filters.formName.name,
            search: serverSearching ? search : null,
          },
        })
        .then((res) => res.data.data as Application[]),
    enabled: !!filters.formName?.name,
  });

  const increasePage = () => setPage((old) => old + 1);
  const decreasePage = () => setPage((old) => Math.max(old - 1, 1));

  /*
   * Triggers a search through all applications in the server
   */
  const handleSearch = () => {
    console.log(search);
    setServerSearching(true);
  };

  const filterPredicate = (application: Application) =>
    Object.values(filters).every((filter: Filter<Application>) =>
      filter.predicate(application),
    );

  const searchFilter = (application: Application) =>
    search === "" ||
    JSON.stringify(application).toLowerCase().includes(search.toLowerCase());

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

  return {
    applications,
    search,
    setSearch: (searchTerm: string) => {
      setServerSearching(false);
      setSearch(searchTerm);
    },
    handleSearch,
    filters,
    setFilters: updateFilter,
    isLoading: query.isLoading,
    error: query.error,
    formNames: infoQuery.data ?? [],
    page,
    increasePage,
    decreasePage,
  };
};
