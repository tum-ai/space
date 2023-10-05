"use client";
import { useState } from "react";
import { Application } from "@models/application";
import { Filter } from "@lib/types/filter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReviewTool = (pageSize = 100, formType: string) => {
  type Filters = Record<string, Filter<Application>>;
  const [serverSearching, setServerSearching] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [searchTerm, setSearchTerm] = useState("");

  const updateFilter = (
    filterName: string,
    name: string,
    predicate: (app: Application) => boolean,
  ) => {
    setFilters((old) => ({
      ...old,
      [filterName]: {
        name,
        predicate,
      },
    }));
  };

  const [page, setPage] = useState(1);

  const applicationsQuery = useQuery({
    queryKey: [
      "applications",
      page,
      serverSearching && searchTerm,
      filters["formName"],
    ],
    queryFn: () =>
      axios
        .get("/applications/", {
          params: {
            page,
            page_size: serverSearching ? null : pageSize,
            form_type: formType,
            search: serverSearching ? searchTerm : null,
          },
        })
        .then((res) => res.data.data as Application[]),
  });

  const increasePage = () => setPage((old) => old + 1);
  const decreasePage = () => setPage((old) => Math.max(old - 1, 1));

  const filterPredicate = (application: Application) => {
    return Object.values(filters).every((filter: Filter<Application>) => {
      return filter.predicate(application);
    });
  };

  const setSearch = (searchTerm: string) => {
    setServerSearching(false);

    if (searchTerm === "") {
      setFilters(({ ["search"]: _, ...rest }) => rest);
      setSearchTerm("");
      return;
    }

    setSearchTerm(searchTerm);
    const predicate = (application: Application) => {
      const relevant_idxs = ["first name", "last name"].map(
        (keyword) =>
          applicationsQuery.data
            ?.at(0)
            ?.submission.data.fields.findIndex((field) => {
              return field.label?.toLowerCase().trim() === keyword;
            }),
      );
      return relevant_idxs.some((relevant_idx) => {
        const value = application.submission.data.fields[relevant_idx]?.value;

        return (
          typeof value === "string" &&
          value?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    };

    updateFilter("search", searchTerm, predicate);
  };

  const applications = applicationsQuery.data?.filter(filterPredicate);

  return {
    applications,
    search: searchTerm,
    setSearch,
    handleSearch: () => setServerSearching(true),
    filters,
    updateFilter,
    isLoading: applicationsQuery.isLoading,
    error: applicationsQuery.error,
    page,
    increasePage,
    decreasePage,
  };
};
