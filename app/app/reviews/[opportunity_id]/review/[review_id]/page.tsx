"use client";

import { Section } from "@components/Section";
import { useEffect, useState, createContext } from "react";
import ReviewInputColumn from "./components/ReviewInputColumn";
import ReviewInfoColumn from "./components/ReviewInfoColumn";
import ReviewToolBar from "./components/ReviewToolBar";
import { Question, Answer, OpportunityQuestions } from "./types";

export default function Review({ params }) {
  const review_id = decodeURIComponent(params.review_id);
  const [view, setView] = useState<"review" | "application" | "both">("both");
  const mockApplicationData = {
    first_name: "Bryan",
    last_name: "Alvin",
    nationality: "Indonesian",
    date_of_birth: "08.11.2001",
    university: "Technical University of Munich",
    degree: "Computer Science",
    semester: "5",
  };

  const [questions, setQuestions] = useState<OpportunityQuestions>([
    {
      id: 1,
      question: "Why is this participant a good fit?",
      answer: "",
    },
    {
      id: 2,
      question: "Fit for TUM.ai",
      answer: 0,
    },
    {
      id: 3,
      question: "Which category do you think they are?",
      answer: "",
      options: ["Definitely not", "Could be", "Definitely yes"],
    },
  ]);

  useEffect(() => {
    //TODO from the id, fetch the application information from backend, pass it to ReviewInfoColumn
    //TODO get the opportunity questions from the backend, pass it to ReviewInputColumn
  }, []);

  const changeView = (newView: "review" | "application" | "both") => {
    setView(newView);
  };

  const handleSave = () => {
    //todo save the changes to db on the 'temporary save'
  };

  const handleSubmit = () => {
    console.info(questions);
  };

  const handleAnswerChange = (
    id: number,
    newValue: string | number | string[],
  ) => {
    console.info("SOMETHING CHANGED!!!");
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, answer: newValue } : question,
      ),
    );
  };

  return (
    <Section>
      <div className="flex flex-col gap-8">
        <h1 className="text-6xl font-thin">Application: {review_id}</h1>
        <ReviewToolBar
          changeView={changeView}
          handleSave={handleSave}
          handleSubmit={handleSubmit}
        ></ReviewToolBar>
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
            <ReviewInfoColumn application={mockApplicationData} />
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
            <ReviewInputColumn
              questions={questions}
              handler={handleAnswerChange}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
