"use client";

import { Card } from "@components/ui/card";
import { EditIcon } from "lucide-react";
import { Slider } from "@components/ui/slider";

export default function SliderCard({ data, handler }) {
  //DEFAULT MAXIMUM VALUE OF 5
  return (
    <div>
      <Card className="flex min-w-full flex-col gap-4 p-4">
        <div className="flex gap-4">
          <EditIcon />
        </div>
        <p>{data.question}</p>
        <div className="flex gap-4">
          <div className="w-12">{data.answer} / 5</div>
          <Slider
            value={[data.answer]}
            max={5}
            step={1}
            onValueChange={(evt) => handler(data.id, evt[0])}
          />
        </div>
      </Card>
    </div>
  );
}
