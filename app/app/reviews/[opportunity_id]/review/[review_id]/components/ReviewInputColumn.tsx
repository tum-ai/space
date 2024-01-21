"use client";

import InputCard from "./inputs/InputCard";
import SliderCard from "./inputs/SliderCard";
import { useState } from "react";
import SelectCard from "./inputs/SelectCard";
import { Question } from "../types";

export default function ReviewInputColumn({ questions, handler }) {
  //todo get the questions from the backend, loop through all the questions and displays the corresponding input type

  return (
    <div className="flex h-[42rem] flex-col gap-4 overflow-y-auto rounded-md border-2 border-slate-600 p-4">
      {questions.map((question: Question) => {
        if ("options" in question) {
          return <SelectCard data={question} handler={handler} />;
        } else if (typeof question.answer === "string") {
          return <InputCard data={question} handler={handler} />;
        } else if (typeof question.answer === "number") {
          return <SliderCard data={question} handler={handler} />;
        }
      })}
    </div>
  );
}
