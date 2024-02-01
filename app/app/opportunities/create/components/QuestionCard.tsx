"use client";

import { Card } from "@components/ui/card";
import { EditIcon, HashIcon, ListIcon, TrashIcon } from "lucide-react";
import { Badge } from "@components/ui/badge";

export default function QuestionCard({ question, index, onRemoveQuestion }) {
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
        <TrashIcon onClick={() => onRemoveQuestion(index)} />
      </div>
      <div className="flex gap-4">
        <Badge variant="secondary">Question</Badge>
        <span className="font-semibold">{question.question}</span>
      </div>
      {question.options ? (
        <div className="flex flex-col gap-2">
          {question.options.map((option: string, index: number) => (
            <Card className="flex gap-4 p-2">
              <div className="flex gap-4">
                <Badge variant="secondary">{index + 1}</Badge>
                <span>{option}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
      {question.maxValue ? (
        <Card className="flex gap-4 p-2">
          <div className="flex gap-4">
            <Badge variant="secondary">Max</Badge>
            <span>{question.maxValue}</span>
          </div>
        </Card>
      ) : null}
    </Card>
  );
}
