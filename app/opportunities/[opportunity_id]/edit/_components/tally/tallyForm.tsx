"use client";

import { format } from "date-fns";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Copy, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "trpc/react";
import { type TallyField, type Tally } from "@lib/types/tally";
import { TallyFieldForm } from "./tallyFieldForm";
import { useEffect, useState } from "react";
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
import { type Application } from "@prisma/client";

export const TallyForm = ({ opportunityId }: { opportunityId: string }) => {
  const { data: applicationList, refetch: refetchApplications } =
    api.application.getAllByOpportunity.useQuery(Number(opportunityId));

  const [selectedApplication, setSelectedApplication] = useState<
    string | undefined
  >(undefined);

  const { data: application } = api.application.getById.useQuery(
    Number(selectedApplication),
    { enabled: !!selectedApplication },
  );

  const getTallyFields = (
    application?: Application | null,
  ): TallyField[] | undefined => {
    return (application?.content as Tally)?.data?.fields;
  };

  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(
        `${window.location.origin}/api/tally/opportunity/${opportunityId}`,
      );
    }
  }, [opportunityId]);

  return (
    <div className="flex flex-col gap-8">
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
            <Select
              value={selectedApplication}
              onValueChange={setSelectedApplication}
            >
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
            <ResizablePanel defaultSize={50}>
              <Card className="h-full overflow-y-scroll">
                <CardHeader>
                  <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Assignment rules
                  </CardTitle>
                  <CardDescription>
                    Define rules to decide which questionnaires to assign to an
                    application
                  </CardDescription>
                </CardHeader>
              </Card>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <Card className="h-full overflow-y-scroll">
                <CardHeader>
                  <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Application Form
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="sticky grid gap-8">
                    {getTallyFields(application)?.map((field) => (
                      <TallyFieldForm field={field} key={field.key} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
};
