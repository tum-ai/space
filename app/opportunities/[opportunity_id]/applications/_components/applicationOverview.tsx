"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import { Card } from "@components/ui/card";
import { useMemo, useState } from "react";
import { cn } from "@lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@components/ui/button";
import {
  Handshake,
  LoaderCircle,
  Maximize,
  MessageSquareText,
  Minimize,
  Search,
} from "lucide-react";
import { type OpportunityPhase } from "../page";
import { api } from "trpc/react";
import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import { Input } from "@components/ui/input";
import { Separator } from "components/ui/separator";
import { AvatarStack } from "@components/user/users-stack";
import { usePathname, useRouter } from "next/navigation";

interface SelectionState {
  questionnaire?: string;
  application?: number;
}
interface Props {
  phases: OpportunityPhase[];
  isAdmin: boolean;
  opportunityId: number;
  initialSelection: SelectionState;
}

export const ApplicationOverview = ({
  phases,
  isAdmin,
  initialSelection,
}: Props) => {
  const [selectionState, setSelectionState] = useState<{
    questionnaire?: string;
    application?: number;
  }>(initialSelection);

  const { questionnaire: questionnaireId, application: applicationId } =
    selectionState;

  const pathname = usePathname();
  const router = useRouter();

  const updateSelection = (data: typeof selectionState) => {
    setSelectionState(data);

    const params = new URLSearchParams();
    if (data.questionnaire) params.set("questionnaire", data.questionnaire);
    if (data.application) params.set("application", String(data.application));
    router.push(pathname + "?" + params.toString());
  };

  const selectedQuestionnaire = useMemo(() => {
    return phases
      .flatMap((phase) => phase.questionnaires)
      .find((questionnaire) => questionnaire.id === questionnaireId);
  }, [phases, questionnaireId]);

  const selectedPhase = useMemo(() => {
    return phases.find((phase) => phase.id === selectedQuestionnaire?.phaseId);
  }, [phases, selectedQuestionnaire?.phaseId]);

  const applicationQuery = api.application.getById.useQuery(
    applicationId ?? -1,
  );

  const [searchValue, setSearchValue] = useState("");
  const filteredApplications = useMemo(() => {
    if (!selectedQuestionnaire) return undefined;
    if (!searchValue) return selectedQuestionnaire.applications;

    return selectedQuestionnaire.applications.filter((application) => {
      return application.name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
    });
  }, [searchValue, selectedQuestionnaire]);

  const [isApplicationMaximized, setIsApplicationMaximized] = useState(false);

  return (
    <Card className="flex h-full min-h-0">
      <ResizablePanelGroup
        direction={"horizontal"}
        autoSaveId="opportunities-overview"
      >
        {!isApplicationMaximized && (
          <>
            <ResizablePanel defaultSize={25} className="space-y-4" order={1}>
              <h3 className="scroll-m-20 p-4 pb-0 text-2xl font-semibold tracking-tight">
                Phases
              </h3>
              <Separator />

              <ScrollArea className="h-full overflow-y-auto">
                <div className="flex h-full flex-col gap-2 p-4 pt-0">
                  {phases.map((phase) => (
                    <div key={`phase-${phase.id}`} className="space-y-2">
                      {isAdmin && phase.isInterview ? (
                        <Button
                          variant="link"
                          className="h-min p-0 text-sm font-semibold"
                          asChild
                        >
                          <Link
                            href={`./interview/${phase.id}`}
                            className="flex items-center truncate"
                          >
                            <Handshake className="mr-2 h-4 w-4" />
                            {phase.name}
                          </Link>
                        </Button>
                      ) : (
                        <span className="flex items-center truncate text-sm font-semibold">
                          {phase.isInterview && (
                            <Handshake className="mr-2 h-4 w-4" />
                          )}
                          {phase.name}
                        </span>
                      )}
                      <div className="flex flex-col gap-2">
                        {phase.questionnaires.map((questionnaire) => (
                          <Card
                            key={`questionnaire-${questionnaire.id}`}
                            onClick={() =>
                              updateSelection({
                                questionnaire: questionnaire.id,
                                application: undefined,
                              })
                            }
                            className={cn(
                              "flex cursor-pointer flex-row items-center justify-between p-2 transition-colors",
                              questionnaire.id === questionnaireId &&
                                "bg-muted",
                            )}
                          >
                            <p className="truncate text-sm">
                              {questionnaire.name}
                            </p>
                            <AvatarStack
                              users={questionnaire.reviewers}
                              size="sm"
                              maxVisible={4}
                            />
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={25}
              className="flex flex-col gap-4"
              order={2}
            >
              <h3 className="scroll-m-20 p-4 pb-0 text-2xl font-semibold tracking-tight">
                Applications
              </h3>
              <Separator />
              <div className="relative m-4 mt-0">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-8"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <ScrollArea className="h-full overflow-y-auto">
                <div className="m-4 mt-0 flex flex-col gap-2">
                  {filteredApplications?.map((application) => (
                    <Card
                      onClick={() =>
                        updateSelection({
                          questionnaire: questionnaireId,
                          application: application.id,
                        })
                      }
                      key={`application-${application.id}`}
                      className={cn(
                        "flex cursor-pointer flex-row items-center justify-between p-2 transition-colors",
                        application.id === applicationId && "bg-muted",
                      )}
                    >
                      <p className="truncate text-sm">{application.name}</p>
                      {application.reviews && (
                        <AvatarStack
                          users={application.reviews.map(
                            (review) => review.user,
                          )}
                          size="sm"
                          maxVisible={4}
                        />
                      )}
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />
          </>
        )}

        <ResizablePanel defaultSize={50} order={3}>
          <div className="flex h-16 items-center justify-between">
            {applicationQuery.isLoading && (
              <LoaderCircle className="mx-4 animate-spin" />
            )}
            {applicationQuery.data && (
              <>
                <h3 className="mx-4 scroll-m-20 text-2xl font-semibold tracking-tight">
                  {applicationQuery.data?.name}
                </h3>

                <div className="mx-4 flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setIsApplicationMaximized((prev) => !prev);
                        }}
                      >
                        {isApplicationMaximized ? <Minimize /> : <Maximize />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isApplicationMaximized ? "Minimize" : "Maximize"}</p>
                    </TooltipContent>
                  </Tooltip>

                  {selectedPhase?.isInterview && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline" disabled>
                          <MessageSquareText />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start review</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </>
            )}
          </div>

          <Separator />
          {!!applicationQuery.data && (
            <div className="m-4 h-full overflow-y-auto">
              <ApplicationForm application={applicationQuery.data} />
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
};
