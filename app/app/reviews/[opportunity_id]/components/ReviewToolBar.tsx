"use client";

import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { EditIcon, SendIcon } from "lucide-react";

export default function ReviewToolBar({ changeView }) {
  return (
    <div className="flex flex-row justify-center gap-2">
      <Tabs defaultValue="both">
        <TabsList className="h-10">
          <TabsTrigger
            value="application"
            onClick={() => changeView("application")}
          >
            Application
          </TabsTrigger>
          <TabsTrigger value="review" onClick={() => changeView("review")}>
            Review
          </TabsTrigger>
          <TabsTrigger value="both" onClick={() => changeView("both")}>
            Both
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button className="flex flex-row gap-2" variant="secondary">
        <EditIcon className="h-4" />
        <span>Save Changes</span>
      </Button>
      <Button className="flex flex-row gap-2" variant="default">
        <SendIcon className="h-4" />
        <span>Submit</span>
      </Button>
    </div>
  );
}
