"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Filter } from "@lib/types/filter";
import type { User } from "@prisma/client";

export const useProfiles = () => {
  type Filters = Record<string, Filter<User>>;
  const [filters, setFilters] = useState<Filters>({});
  const [search, setSearch] = useState("");

  // if searching becomes to slow we can extend the api to only return the profiles that match the search 

  const query = useQuery({
    queryKey: ["profiles"],
    queryFn: () =>
      axios.get("http://localhost:3000/api/profiles/").then((res) => res.data.profiles as User[]).catch((err) => []),
  });

  // TODO: Search is not implemented
  const filterPredicate = (profile: User) =>
    Object.values(filters).every((filter: Filter<User>) =>
      filter.predicate(profile),
    );

  
  let filteredProfiles = query.data?.filter(filterPredicate);
  if (filteredProfiles === undefined) {
    filteredProfiles = [];
  }

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
