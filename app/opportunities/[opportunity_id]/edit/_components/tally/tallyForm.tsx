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
import { Copy, Plus, RotateCcw, Save, Send } from "lucide-react";
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
import type { Opportunity, Application } from "@prisma/client";
import { usePhasesContext } from "../phases/usePhasesStore";
import { type Phases } from "@lib/types/opportunity";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/ui/command";

export const TallyForm = ({
  opportunity,
  update,
}: {
  opportunity: Opportunity;
  update: (input: Phases) => Promise<void>;
}) => {
  const { data: applicationList, refetch: refetchApplications } =
    api.application.getAllByOpportunity.useQuery(Number(opportunity.id));

  const [selectedApplication, setSelectedApplication] = useState<
    string | undefined
  >(opportunity.schemaId ? String(opportunity.schemaId) : undefined);

  const { data: application } = api.application.getById.useQuery(
    Number(selectedApplication),
    { enabled: !!selectedApplication },
  );

  const getTallyFields = (
    application?: Application | null,
  ): TallyField[] | undefined => {
    return (application?.content as Tally)?.data?.fields;
  };

  const phases = usePhasesContext((s) => s.phases);

  async function onSubmit() {
    const id = toast.loading("Updating application related settings");
    try {
      await update({ phases, schemaId: Number(selectedApplication) });
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

  const [open, setOpen] = useState(false);
  const [questionnairesWithRules, setQuestionnairesWithRules] = useState([]);

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
                    Set rules to determine which questionnaires are assigned to
                    an application. Questionnaires without specific rules will
                    be assigned to all applicants.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="h-32 w-full items-center justify-center border-dashed"
                      >
                        <Plus className="mr-2" />
                        Add questionnaire rule
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search questionnaire..." />
                        <CommandList>
                          <CommandEmpty>No questionnaire found.</CommandEmpty>

                          {phases.map((phase) => (
                            <CommandGroup heading={phase.name} key={phase.id}>
                              {phase.questionnaires.map((q) => (
                                <CommandItem
                                  keywords={[phase.name, q.name]}
                                  key={q.id}
                                  value={q.id}
                                  onSelect={(currentValue) => {
                                    setQuestionnairesWithRules((prev) => ({
                                      ...prev,
                                      currentValue,
                                    }));
                                    setOpen(false);
                                  }}
                                >
                                  {q.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            </ResizablePanel>
            <ResizableHandle withHandle />
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

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onSubmit}>
          <Save className="mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
