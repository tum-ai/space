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
import { Copy, Plus, RotateCcw, Save, Send, X } from "lucide-react";
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
import { SelectQuestionnaireCombobox } from "./select-questionnaire-combobox";
import { ApplicationField } from "@components/application/applicationField";

const Rule = () => {
  const [questionnaire, setQuestionnaire] = useState("");
  return (
    <Card className="p-2">
      <div className="flex items-center gap-2 text-sm">
        Assign
        <SelectQuestionnaireCombobox
          value={questionnaire}
          setValue={setQuestionnaire}
        />
        if
      </div>
    </Card>
  );
};

const Name = ({
  fields,
  selectFun,
  isSelecting,
  setSelecting,
}: {
  fields?: TallyField[];
  selectFun: React.MutableRefObject<
    ((field: TallyField["key"]) => void) | undefined
  >;
  isSelecting: boolean;
  setSelecting: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
                    className="hover:bg-destructive hover:text-destructive-foreground"
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

        {isSelecting && (
          <>
            <X className="mr-2" />
            <Button variant="outline" onClick={() => setSelecting(false)}>
              Cancel
            </Button>
          </>
        )}
        {!isSelecting && (
          <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Plus className="mr-2" />
            <Button
              variant="outline"
              className="border-dashed"
              onClick={() => {
                const fun = (key: TallyField["key"]) =>
                  setNameKeys((prev) => [...prev, key]);
                selectFun.current = fun;
                setSelecting(true);
              }}
            >
              Add field
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
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

  const getTallyFields = (
    application?: Application | null,
  ): TallyField[] | undefined => {
    return (application?.content as Tally)?.data?.fields;
  };

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

  const [addRuleOpen, setAddRuleOpen] = useState(false);
  const selectFun = useRef<((key: TallyField["key"]) => void) | undefined>(
    undefined,
  );
  const [isSelecting, setSelecting] = useState(false);

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
              <Name
                fields={getTallyFields(application)}
                selectFun={selectFun}
                isSelecting={isSelecting}
                setSelecting={setSelecting}
              />

              <Card className="flex-1 overflow-y-scroll">
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

                <CardContent className="space-y-2">
                  {addRuleOpen && <Rule />}
                  <Button
                    variant="outline"
                    onClick={() => setAddRuleOpen(true)}
                    className="h-32 w-full items-center justify-center border-dashed"
                  >
                    <Plus className="mr-2" />
                    Add questionnaire rule
                  </Button>
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
                    {getTallyFields(application)?.map((field) => {
                      const select = selectFun.current;

                      return (
                        <div key={field.key} className="flex items-end gap-2">
                          {isSelecting && select && (
                            <Button
                              onClick={() => {
                                select(field.key);
                                setSelecting(false);
                              }}
                              size="icon"
                              variant="outline"
                            >
                              <Plus />
                            </Button>
                          )}
                          <ApplicationField field={field} className="w-full" />
                        </div>
                      );
                    })}
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
