"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@models/profile";
import { useState } from "react";
import { Filter } from "util/types/filter";

export const useProfiles = () => {
  type Filters = Record<string, Filter<Profile>>;
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["profiles"],
    queryFn: () =>
      axios.get("/profiles/").then((res) => res.data.data as Profile[]),
  });

  // TODO: Search is not implemented
  const filterPredicate = (profile: Profile) =>
    Object.values(filters).every((filter: Filter<Profile>) =>
      filter.predicate(profile),
    );

  const filteredProfiles = query.data?.filter(filterPredicate);

  return {
    profiles: filteredProfiles,
    hasFilters: !!Object.keys(filters)?.length,
    search,
    setSearch,
    filters,
    setFilters,
    isLoading: query.isLoading,
  };
};