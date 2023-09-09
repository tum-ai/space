"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@models/profile";
import { useState } from "react";

export interface Filter {
  name: string;
  predicate: (profile: Profile) => boolean;
}

export const useProfiles = () => {
  type Filters = Record<string, Filter>;
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");
  const profilesQuery = useQuery({
    queryKey: ["profiles"],
    queryFn: () =>
      axios.get("/profiles/").then((res) => res.data.data as Profile[]),
  });
  const filterPredicate = (profile: Profile) =>
    Object.values(filters).every((filter: Filter) => filter.predicate(profile));

  const filteredProfiles = profilesQuery.data?.filter(filterPredicate);

  return {
    profiles: filteredProfiles,
    hasFilters: !!Object.keys(filters)?.length,
    search,
    setSearch,
    filters,
    setFilters,
    isLoading: profilesQuery.isLoading,
  };
};
