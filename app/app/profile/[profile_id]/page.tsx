"use client";

import { api } from "trpc/react";
import ProfileOverview from "../components/ProfileOverview";
import LoadingWheel from "@components/LoadingWheel";

const Me = () => {
  const { data, isLoading } = api.user.getById.useQuery({
    id: "me",
    options: { withProfile: true },
  });

  if (isLoading) return <LoadingWheel />;

  if (data) return <ProfileOverview profile={data} />;
};

export default Me;
