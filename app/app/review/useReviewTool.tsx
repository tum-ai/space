"use client";
import { useState } from "react";
import { Application } from "@models/application";
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

  const applications = query.data?.filter(filterPredicate);

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
