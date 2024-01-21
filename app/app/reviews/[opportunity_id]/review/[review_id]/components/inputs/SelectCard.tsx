"use client";

import { Card } from "@components/ui/card";
import { EditIcon } from "lucide-react";
import Select from "@components/Select";
import { Answer } from "../../types";

export default function SelectCard({ data, handler }) {
  return (
    <div>
      <Card className="flex min-w-full flex-col gap-4 p-4">
        <div className="flex gap-4">
          <EditIcon />
          <p>{data.title}</p>
        </div>
        <p>{data.question}</p>
        <Select
          placeholder=""
          options={data.options.map((option: Answer) => {
            return {
              key: option,
              value: option,
            };
          })}
          value={data.answer}
          setSelectedItem={(item: Answer) => handler(data.id, item)}
        />
      </Card>
    </div>
  );
}
