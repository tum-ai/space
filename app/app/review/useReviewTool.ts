"use client";
import { useState } from "react";
import { Application } from "@models/application";
import { Filter } from "util/types/filter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Predicate<T> = (t: T) => boolean;

export const useReviewTool = (page_size = 100) => {
  type Filters = Record<string, Filter<Application>>;
  const [serverSearching, setServerSearching] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [searchPredicate, setSearchPredicate] = useState<
    Predicate<Application>
  >(function (_app: Application) {
    return true;
  });
  const [searchTerm, setSearchTerm] = useState("");

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

  const applicationsQuery = useQuery({
    queryKey: ["applications", page, serverSearching && searchTerm, filters],
    queryFn: () =>
      axios
        .get("/applications/", {
          params: {
            page,
            page_size,
            form_type: filters.formName.name,
            search: serverSearching ? searchTerm : null,
          },
        })
        .then((res) => res.data.data as Application[]),
    enabled: !!filters.formName?.name,
  });

  const increasePage = () => setPage((old) => old + 1);
  const decreasePage = () => setPage((old) => Math.max(old - 1, 1));

  const filterPredicate = (application: Application) =>
    Object.values(filters).every((filter: Filter<Application>) =>
      filter.predicate(application),
    );

  // TODO: add final score comparator to server db call
  const applications = applicationsQuery.data
    ?.filter(filterPredicate)
    .filter(searchPredicate);

  return {
    applications,
    searchPredicate,
    search: searchTerm,
    setSearch: (searchTerm: string) => {
      setServerSearching(false);
      setSearchTerm(searchTerm);

      const predicate = (application: Application) => {
        const relevant_ids = ["first name", "last name"].map(
          (keyword) =>
            applications?.at(0)?.submission.data.fields.findIndex((field) => {
              return field.label?.toLowerCase().trim() === keyword;
            }),
        );

        return relevant_ids.some((relevant_id) => {
          console.log(application.submission.data.fields[relevant_id].value);
          return (
            application.submission.data.fields[relevant_id].value ===
            searchTerm.toLowerCase()
          );
        });
      };

      setSearchPredicate(predicate);
    },
    handleSearch: () => setServerSearching(true),
    filters,
    setFilters: updateFilter,
    isLoading: applicationsQuery.isLoading,
    error: applicationsQuery.error,
    formNames: infoQuery.data ?? [],
    page,
    increasePage,
    decreasePage,
  };
};
