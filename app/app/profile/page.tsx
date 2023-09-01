"use client";

import { Section } from "@components/Section";
import ProfileOverview from "./components/ProfileOverview";
import { useStores } from "@providers/StoreProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { profileModel } = useStores();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    profileModel.getProfile(typeof id === "string" ? id : id[0]);
  }, [profileModel, id]);

  const profile = profileModel.profile;

  if (profileModel.loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <Section>
      <ProfileOverview profile={profile} />
    </Section>
  );
}
