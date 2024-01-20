"use client";

import { Section } from "@components/Section";
import { useEffect, useState } from "react";
import ReviewInputColumn from "../../components/ReviewInputColumn";
import ReviewInfoColumn from "../../components/ReviewInfoColumn";
import ReviewToolBar from "../../components/ReviewToolBar";
export default function Review({ params }) {
  const review_id = decodeURIComponent(params.review_id);
  const [view, setView] = useState<"review" | "application" | "both">("both");

  useEffect(() => {
    //TODO from the id, fetch the application. for now we use mocked data
  }, []);

  const changeView = (newView: "review" | "application" | "both") => {
    setView(newView);
  };

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <h1 className="text-6xl font-thin">Application: {review_id}</h1>
        <ReviewToolBar changeView={changeView}></ReviewToolBar>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={
              view === "application"
                ? "col-span-2 block"
                : view === "both"
                ? "col-span-1"
                : "hidden"
            }
          >
            <ReviewInfoColumn />
          </div>
          <div
            className={
              view === "review"
                ? "col-span-2 block"
                : view === "both"
                ? "col-span-1"
                : "hidden"
            }
          >
            <ReviewInputColumn />
          </div>
        </div>
      </div>
    </Section>
  );
}
