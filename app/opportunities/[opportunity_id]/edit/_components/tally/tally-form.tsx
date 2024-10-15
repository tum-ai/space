"use client";

import { format } from "date-fns";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Copy, RotateCcw, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "trpc/react";
import { type TallyField, type Tally } from "@lib/types/tally";
import { useEffect, useRef, useState } from "react";
import { Label } from "@components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import type { Opportunity, Application } from "@prisma/client";
import { usePhasesContext } from "../phases/usePhasesStore";
import { type Phases } from "@lib/types/opportunity";
import { ApplicationForm } from "./application-form";
import { NameForm } from "./name-form";
import { AssignmentForm } from "./assignment-form";

export type SelectingState =
  | {
      types: TallyField["type"][];
      multiple: boolean;
      intent: string;
    }
  | undefined;

export type SelectingProps = {
  selecting: SelectingState;
  setSelecting: React.Dispatch<React.SetStateAction<SelectingState>>;
  selectFun: React.MutableRefObject<((field: TallyField) => void) | undefined>;
};

export const getTallyFields = (
  application?: Application | null,
): TallyField[] | undefined => {
  return (application?.content as Tally)?.data?.fields;
};

export const TallyForm = ({
  opportunity,
  update,
}: {
  opportunity: Opportunity;
  update: (input: Phases) => Promise<void>;
}) => {
  const { data: applicationList, refetch: refetchApplications } =
    api.application.getAllByOpportunity.useQuery(Number(opportunity.id));

  const [schemaId, setSchemaId] = useState<string | undefined>(
    opportunity.schemaId ? String(opportunity.schemaId) : undefined,
  );

  const { data: application } = api.application.getById.useQuery(
    Number(schemaId),
    { enabled: !!schemaId },
  );

  const phases = usePhasesContext((s) => s.phases);

  async function onSubmit() {
    const id = toast.loading("Updating application related settings");
    try {
      await update({ phases, schemaId: Number(schemaId) });
      toast.success("Application settings updated successfully!", { id });
    } catch (_err) {
      toast.error("Error updating application settings. Please try again.", {
        id,
      });
    }
  }

  const [webhookUrl, setWebhookUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(
        `${window.location.origin}/api/tally/opportunity/${opportunity.id}`,
      );
    }
  }, [opportunity.id]);

  const selectFun = useRef<((key: TallyField) => void) | undefined>(undefined);
  const [selecting, setSelecting] = useState<SelectingState>();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Application
        </h3>
        <p className="text-muted-foreground">
          Configure the review process and specify the fields of interest for
          the application.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="w-full space-y-2">
          <Label>Webhook url</Label>
          <div className="flex w-full gap-2">
            <Input type="text" readOnly value={webhookUrl} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                toast.promise(navigator.clipboard.writeText(webhookUrl), {
                  loading: "Copying to clipboard",
                  success: "Copied to clipboard",
                  error: "Failed to copy to clipboard",
                });
              }}
            >
              <Copy />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Set this Webhook url in Tally to receive the applications
          </p>
        </div>

        <div className="space-y-2">
          <Label>Choose an application</Label>

          <div className="flex w-full gap-2">
            <Select value={schemaId} onValueChange={setSchemaId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose application" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {applicationList &&
                    Object.entries(
                      applicationList.reduce(
                        (acc, application) => {
                          const date = new Date(
                            application.createdAt,
                          ).toDateString();
                          if (!acc[date]) acc[date] = [];
                          acc[date].push(application);
                          return acc;
                        },
                        {} as Record<string, typeof applicationList>,
                      ),
                    ).map(([date, applications]) => (
                      <SelectGroup key={date}>
                        <SelectLabel>{date}</SelectLabel>
                        {applications.map((application) => (
                          <SelectItem
                            key={application.id}
                            value={String(application.id)}
                          >
                            <span className="font-mono font-semibold">
                              {format(new Date(application.createdAt), "HH:mm")}
                            </span>
                            {!!application.name && <> - {application.name}</>}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => refetchApplications()}
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </div>

      {!getTallyFields(application)?.length && (
        <div className="flex justify-center">
          <Alert className="w-max">
            <Send className="h-4 w-4" />
            <AlertTitle>No Application Selected</AlertTitle>
            <AlertDescription>
              Please choose an application from the dropdown menu to begin.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!!getTallyFields(application)?.length && (
        <div className="h-[80vh]">
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="tallyform-config"
            className="gap-4"
          >
            <ResizablePanel defaultSize={50} className="flex flex-col gap-4">
              <NameForm
                fields={getTallyFields(application)}
                selectFun={selectFun}
                selecting={selecting}
                setSelecting={setSelecting}
              />

              <AssignmentForm
                fields={getTallyFields(application)}
                selectFun={selectFun}
                selecting={selecting}
                setSelecting={setSelecting}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <ApplicationForm
                application={application!}
                selecting={selecting}
                setSelecting={setSelecting}
                selectFun={selectFun}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onSubmit}>
          <Save className="mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
