"use client";

import ProfileOverview from "./components/ProfileOverview";
import { observer } from "mobx-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const Profile = () => {
  const id = useSearchParams().get("id");

  const profileQuery = useQuery({
    queryKey: [`profile-${id}`],
    queryFn: () => axios.get(`/profile/${id}`),
  });

  if (profileQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  if (profileQuery.error) {
    return <h1>Profile not found.</h1>;
  }

  return <ProfileOverview profile={profileQuery.data.data.data} />;
};

export default observer(Profile);
