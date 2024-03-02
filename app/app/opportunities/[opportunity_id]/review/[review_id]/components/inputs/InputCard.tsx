"use client";

import { Card } from "@components/ui/card";
import { EditIcon } from "lucide-react";
import { Textarea } from "@components/ui/textarea";

export default function InputCard({ data }) {
  return (
    <div>
      <Card className="flex min-w-full flex-col gap-4 p-4">
        <div className="flex gap-4">
          <EditIcon />
          <p>{data.title}</p>
        </div>
        <p>{data.question}</p>
        <Textarea onChange={(evt) => {}} />
      </Card>
    </div>
  );
}
