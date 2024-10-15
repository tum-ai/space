"use client";

import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Plus } from "lucide-react";
import { type TallyField } from "@lib/types/tally";
import { useState } from "react";
import { cn } from "@lib/utils";
import { type SelectingProps } from "./tally-form";

export const NameForm = ({
  fields,
  selectFun,
  selecting,
  setSelecting,
}: {
  fields?: TallyField[];
} & SelectingProps) => {
  const [nameKeys, setNameKeys] = useState<string[]>([]);
  if (!fields) return null;

  return (
    <Card className="group overflow-y-scroll">
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Name
        </CardTitle>
        <CardDescription>
          Choose the fields that make up the applicant&apos;s name. The full
          name will be a combination of all selected fields, separated by
          spaces.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center gap-2">
        {!!nameKeys.length && (
          <div className="flex items-center">
            {nameKeys
              .map((key) => fields.find((f) => f.key === key))
              .filter((field) => field !== undefined)
              .map((field, index) => (
                <div key={field?.key} className="flex items-center">
                  <Button
                    variant="outline"
                    className="transition-all hover:line-through"
                    onClick={() =>
                      setNameKeys((keys) =>
                        keys.filter((key) => key != field.key),
                      )
                    }
                  >
                    {field?.label}
                  </Button>
                  {index < nameKeys.length - 1 && <Plus className="mx-2" />}
                </div>
              ))}
          </div>
        )}

        {selecting?.intent === "name" && (
          <Button
            className="ml-auto"
            variant="outline"
            onClick={() => setSelecting(undefined)}
          >
            Done
          </Button>
        )}
        {selecting?.intent !== "name" && (
          <div
            className={cn(
              "flex items-center transition-opacity group-hover:opacity-100",
              !!nameKeys.length && "opacity-0",
            )}
          >
            <Plus className="mr-2" />
            <Button
              variant="outline"
              className="border-dashed"
              onClick={() => {
                selectFun.current = (field: TallyField) =>
                  setNameKeys((prev) => [...prev, field.key]);
                setSelecting({
                  types: ["INPUT_TEXT"],
                  intent: "name",
                  multiple: true,
                });
              }}
            >
              Add fields
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
