"use client";
import { ReviewForm } from "./_components/forms/ReviewForm";
import { ApplicationToReview } from "./ApplicationToReview";

export function Review() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ReviewForm />
      <ApplicationToReview />
    </div>
  );
}