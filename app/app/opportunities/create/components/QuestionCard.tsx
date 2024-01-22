"use client";

import { Card } from "@components/ui/card";
import { EditIcon, HashIcon, ListIcon, TrashIcon } from "lucide-react";

export default function QuestionCard({ question, index, handler }) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        {question.type === "textarea" ? (
          <div className="flex gap-4">
            <EditIcon />
            <span className="font-bold">Text area</span>
          </div>
        ) : question.type === "select" ? (
          <div className="flex gap-4">
            <ListIcon />
            <span className="font-bold">Select</span>
          </div>
        ) : (
          <div className="flex gap-4">
            <HashIcon />
            <span className="font-bold">Number</span>
          </div>
        )}
        <TrashIcon onClick={() => handler(index)} />
      </div>

      <p>{question.question}</p>
      {question.options ? (
        <div className="flex flex-col gap-2">
          {question.options.map((option: string, index: number) => (
            <Card className="flex gap-4 p-2">
              <span>{index} )</span>
              <span>{option}</span>
            </Card>
          ))}
        </div>
      ) : null}
      {question.maxValue ? (
        <Card className="flex gap-4 p-2">
          <span>Max: </span>
          <span>{question.maxValue}</span>
        </Card>
      ) : null}
    </Card>
  );
}
