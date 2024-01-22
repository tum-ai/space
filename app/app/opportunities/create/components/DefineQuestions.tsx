"use client";

import { Card } from "@components/ui/card";
import { Section } from "@components/Section";
import Input from "@components/Input";
import { TrashIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import Select from "@components/Select";
import { useState } from "react";
import QuestionCard from "./QuestionCard";
export interface Question {
  type: "select" | "slider" | "textarea";
  question: string;
  options?: string[];
  maxValue?: number;
}

export default function DefineQuestions() {
  //List of already saved questions
  const [definedQuestions, setDefinedQuestions] = useState([]);

  //States for the Question Input Card
  const [selectedQuestionType, setSelectedQuestionType] = useState<
    "slider" | "textarea" | "select"
  >("textarea");
  const handleSetSelectedQuestionType = (
    type: "slider" | "textarea" | "select",
  ) => {
    setQuestionInput("");
    setSelectedQuestionType(type);
  };

  //state for what the question is
  const [questionInput, setQuestionInput] = useState<string>("");

  //Select
  const [optionInput, setOptionInput] = useState<string>("");

  //Stored options
  const [tmpSelectOptions, setTmpSelectOptions] = useState<string[]>([]);

  const handleAddTmpOption = () => {
    const tmp = [...tmpSelectOptions, optionInput];
    setOptionInput("");
    setTmpSelectOptions(tmp);
  };

  const handleDeleteTmpOption = (indexToDelete: number) => {
    // Creating a new array excluding the element at the specified index
    const newOptions = tmpSelectOptions.filter(
      (_, index) => index !== indexToDelete,
    );

    // Updating the state with the new array
    setTmpSelectOptions(newOptions);
  };

  //Number
  const [tmpMaxValue, setTmpMaxValue] = useState(5);

  //Handler for QUESTION SUBMISSION
  const addQuestion = () => {
    let newQuestion: Question;
    if (selectedQuestionType === "select") {
      newQuestion = {
        type: selectedQuestionType,
        question: questionInput,
        options: tmpSelectOptions,
      };
    } else if (selectedQuestionType === "slider") {
      newQuestion = {
        type: selectedQuestionType,
        question: questionInput,
        maxValue: tmpMaxValue,
      };
    } else {
      newQuestion = {
        type: selectedQuestionType,
        question: questionInput,
      };
    }

    const questions = [...definedQuestions, newQuestion];

    //reset form to initial values
    setTmpMaxValue(5);
    setQuestionInput("");
    setSelectedQuestionType("textarea");
    setDefinedQuestions(questions);
    setTmpSelectOptions([]);
  };

  const deleteQuestion = (indexToDelete: number) => {
    // Creating a new array excluding the element at the specified index
    const newQuestions = definedQuestions.filter(
      (_, index) => index !== indexToDelete,
    );

    // Updating the state with the new array
    setDefinedQuestions(newQuestions);
  };

  return (
    <Card className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">Define questions</h1>
        <Card className="flex flex-col gap-4 p-4">
          <span className="flex gap-4">
            <Select
              placeholder="Question Type"
              options={[
                {
                  key: "Select",
                  value: "select",
                },
                {
                  key: "Text",
                  value: "textarea",
                },
                {
                  key: "Number",
                  value: "slider",
                },
              ]}
              value={selectedQuestionType}
              setSelectedItem={(item: "slider" | "textarea" | "select") =>
                handleSetSelectedQuestionType(item)
              }
            />
            <Input
              placeholder="Add your question here"
              fullWidth
              onChange={(evt) => setQuestionInput(evt.target.value)}
              value={questionInput}
            />
            <Button onClick={addQuestion} className="w-32">
              Add
            </Button>
          </span>
          {selectedQuestionType === "select" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Add your option here"
                  onChange={(evt) => setOptionInput(evt.target.value)}
                  fullWidth
                  value={optionInput}
                />
                <Button onClick={handleAddTmpOption}>+</Button>
              </div>
              <div className="flex flex-col gap-4">
                {tmpSelectOptions.map((item: string, index: number) => (
                  <Card className="flex justify-between gap-2 p-2">
                    <span>{index + ". " + item}</span>

                    <TrashIcon
                      className="h-5"
                      onClick={() => handleDeleteTmpOption(index)}
                    />
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
          {selectedQuestionType === "slider" ? (
            <div>
              <Input
                label="Maximum value"
                placeholder="Max value"
                onChange={(evt) => setTmpMaxValue(Number(evt.target.value))}
                value={tmpMaxValue}
              />
            </div>
          ) : null}
        </Card>
        <div className="flex flex-col gap-4">
          {definedQuestions.map((item: Question, index: number) => (
            <QuestionCard
              question={item}
              index={index}
              handler={deleteQuestion}
            />
          ))}
        </div>
        <Button onClick={() => {}}>Save Questions</Button>
      </div>
    </Card>
  );
}
