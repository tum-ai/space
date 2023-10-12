"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { observer } from "mobx-react";
import { useSearchParams } from "next/navigation";
import ProfileOverview from "./components/ProfileOverview";

const Profile = () => {
  const id = useSearchParams().get("id");

  const profileQuery = useQuery({
    queryKey: [`profile-${id}`],
    queryFn: () => axios.get(`/profile/${id}`).then((res) => res.data),
  });

  if (profileQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  if (profileQuery.error) {
    return <h1>Profile not found.</h1>;
  }

  return <ProfileOverview profile={profileQuery.data.data} publicView={true} />;
};

export default observer(Profile);
