"use client";

import { useStores } from "@/providers/StoreProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProfileOverview from "../profile/components/ProfileOverview";

const Me = () => {
  const { meModel } = useStores();
  const profileQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => axios("/me"),
  });

  // Set editorProfile as soon as data is available
  if (profileQuery.data?.data?.data) {
    meModel.editorProfile = { ...profileQuery.data.data.data };
  }

  if (profileQuery.isLoading) {
    return <h1>Loading profile</h1>;
  }
  if (!profileQuery.data?.data?.data) {
    return <h1>Profile not found.</h1>;
  }

  return (
    <ProfileOverview profile={profileQuery.data.data.data} meModel={meModel} />
  );
};

export default Me;
