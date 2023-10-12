"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProfileOverview from "../profile/components/ProfileOverview";
import { useUser } from "@auth0/nextjs-auth0/client";

const Me = () => {
  const profileQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => axios("/me"),
  });
  const { user, error, isLoading } = useUser();
  if (!user) return "TODO";
  if (isLoading) return <p>TODO Loading</p>;
  if (error) return <p>Error: {error.message}</p>;

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
