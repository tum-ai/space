"use client";

import { Question } from "@lib/types/question";

interface ReviewInputColumnProps {
  questions: Question[];
}

export default function ReviewInputColumn({
  questions,
}: ReviewInputColumnProps) {
  return (
    <div className="flex min-h-[42rem] flex-col gap-4 overflow-y-auto rounded-md border-2 border-slate-600 p-4"></div>
  );
}
