"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@models/profile";
import { useState } from "react";
import { Filter } from "@lib/types/filter";

export const useProfiles = () => {
  type Filters = Record<string, Filter<Profile>>;
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["profiles"],
    queryFn: () =>
      axios.get("http://localhost:3000/api/profiles/").then((res) => res.data.profiles as Profile[]),
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
