"use client";

import ReviewInputColumn from "./components/ReviewInputColumn";
import ReviewInfoColumn from "./components/ReviewInfoColumn";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import { Button } from "@components/ui/button";
import { Save } from "lucide-react";
import MockApplication from "./mock_tally.json";
import MockQuestionnaire from "./mock_questionnaire.json";

interface ReviewProps {
  params: {
    review_id: string;
  };
}

export default function Review({ params }: ReviewProps) {
  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Review application
          </h1>
          <p className="text-muted-foreground">Review a candidate</p>
        </div>

        <Button variant="default" type="submit">
          <Save className="mr-2" />
          Save
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex gap-4">
        <ResizablePanel>
          <ReviewInfoColumn application={[]} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ReviewInputColumn questions={[]} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
