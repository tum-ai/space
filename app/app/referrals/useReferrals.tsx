"use client";
import { Referral } from "@models/referrals";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

/**
 *  Returns all referrals through pages starting with the first page
 *  @param page_size - the size of each page
 *  @returns referrals and function to increase/decrease page number
 */
export const useReferrals = (page_size = 100) => {
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["referrals", page],
    queryFn: () =>
      axios
        .get("/application/referrals/", { params: { page, page_size } })
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const increasePage = () => setPage((old) => old + 1);
  const decreasePage = () => setPage((old) => Math.max(old - 1, 1));

  return {
    referrals: query.data?.data as Referral[],
    hasMore: true, // TODO: This needs to be parsed from the api
    isLoading: query.isLoading,
    page,
    isPreviousData: query.data?.isPreviousData,
    increasePage,
    decreasePage,
  };
};
