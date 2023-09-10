"use client";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import { ApplicationOverview } from "./_components/applicationOverview";

export const ApplicationToReview = observer(() => {
  const { reviewToolModel } = useStores();
  const applicationOnReview = reviewToolModel.applicationOnReview;

  if (!applicationOnReview) {
    return <p>No application selected</p>;
  }

  return <ApplicationOverview data={applicationOnReview} />;
});
