"use client";
import { Section } from "@components/Section";
import ProfileOverview from "../profile/components/ProfileOverview";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";

const Me = () => {
  const { meModel } = useStores();

  const user = meModel.user;
  const profile = user?.profile;

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <Section>
      <ProfileOverview profile={profile} meModel={meModel} />
    </Section>
  );
};

export default observer(Me);
