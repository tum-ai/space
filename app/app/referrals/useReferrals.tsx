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
  const { isLoading, data } = useQuery({
    queryKey: ["referrals", page],
    queryFn: () =>
      axios
        .get("/application/referrals/", { params: { page: 1, page_size } })
        .then((res) => res.data.data as Referral[]),
    keepPreviousData: true,
  });

  const increasePage = () => setPage((old) => old + 1);
  const decreasePage = () => setPage((old) => Math.max(old - 1, 1));

  return {
    isLoading,
    referrals: data,
    page,
    increasePage,
    decreasePage,
  };
};
