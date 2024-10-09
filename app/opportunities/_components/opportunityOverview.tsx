"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import { Card } from "@components/ui/card";
import type { Prisma } from "@prisma/client";
import OpportunityCard from "./opportunityCard";
import { useMemo, useState } from "react";
import { cn } from "@lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  opportunities: Prisma.OpportunityGetPayload<{
    include: {
      phases: {
        include: {
          questionnaires: {
            include: {
              applications: {
                select: {
                  id: true;
                  name: true;
                  reviews: { select: { user: true; id: true } };
                };
              };
              reviewers: true;
            };
          };
        };
      };
      admins: {
        select: {
          id: true;
        };
      };
    };
  }>[];
}

export const OpportunityOverview = ({ opportunities }: Props) => {
  const [
    { opportunity: opportunityId, questionnaire: questionnaireId },
    setSelectionState,
  ] = useState<{
    opportunity?: number;
    questionnaire?: string;
  }>({
    opportunity: undefined,
    questionnaire: undefined,
  });

  const selectedOpportunity = useMemo(() => {
    if (opportunityId == undefined) return undefined;
    return opportunities.find((item) => item.id == opportunityId);
  }, [opportunities, opportunityId]);

  const selectedQuestionnaire = useMemo(() => {
    if (questionnaireId == undefined) return undefined;
    for (const phase of selectedOpportunity?.phases ?? []) {
      for (const questionnaire of phase.questionnaires) {
        if (questionnaire.id == questionnaireId) return questionnaire;
      }
    }
  }, [selectedOpportunity, questionnaireId]);

  return (
    <Card className="flex h-full min-h-0">
      <ResizablePanelGroup direction={"horizontal"}>
        <ResizablePanel defaultSize={25} className="p-4">
          <div className="group flex h-full flex-col gap-4">
            {opportunities.map((item) => {
              return (
                <OpportunityCard
                  key={`opportunity-${item.id}`}
                  opportunity={item}
                  onClick={() =>
                    setSelectionState({
                      opportunity: item.id,
                      questionnaire: undefined,
                    })
                  }
                  className={cn(
                    "cursor-pointer transition-colors",
                    opportunityId === item.id && "bg-muted",
                  )}
                />
              );
            })}

            <Button
              className="h-8 w-full py-1 opacity-0 transition-opacity group-hover:opacity-100"
              variant="outline"
              asChild
            >
              <Link href="./opportunities/create">
                <Plus className="mr-2" /> Add Opportunity
              </Link>
            </Button>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25} className="p-4">
          <div className="flex h-full flex-col gap-2">
            {selectedOpportunity?.phases.map((phase) => (
              <div key={`phase-${phase.id}`} className="space-y-2">
                <div className="font-semi text-sm">{phase.name}</div>
                <div className="flex flex-col gap-2">
                  {phase.questionnaires.map((questionnaire) => (
                    <Card
                      key={`questionnaire-${questionnaire.id}`}
                      onClick={() =>
                        setSelectionState((prev) => ({
                          ...prev,
                          questionnaire: questionnaire.id,
                        }))
                      }
                      className={cn(
                        "flex cursor-pointer flex-row items-center justify-between p-2 transition-colors",
                        questionnaire.id === questionnaireId && "bg-muted",
                      )}
                    >
                      <p className="text-sm">{questionnaire.name}</p>
                      <div className="flex -space-x-2">
                        {[...questionnaire.reviewers]
                          .splice(0, 4)
                          .map((reviewer) => (
                            <Tooltip
                              key={`reviewer-${questionnaire.name}-${reviewer.id}`}
                            >
                              <TooltipTrigger>
                                <Avatar className="h-6 w-6 ring-1 ring-border">
                                  <AvatarImage
                                    src={reviewer.image ?? undefined}
                                  />
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{reviewer.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        {questionnaire.reviewers.length > 4 && (
                          <Avatar className="h-6 w-6 bg-primary-foreground ring-1 ring-border">
                            <AvatarFallback className="text-xs">
                              +{questionnaire.reviewers.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} className="p-4">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex flex-col gap-2">
              {selectedQuestionnaire?.applications?.map((application) => (
                <Link
                  key={`questionnaire-${application.id}`}
                  href={`opportunities/${selectedOpportunity?.id}/applications/${application.id}`}
                >
                  <Card
                    className={cn(
                      "flex flex-row items-center justify-between p-2 transition-colors",
                    )}
                  >
                    <p>{application.name}</p>
                    <div className="flex -space-x-3 overflow-hidden">
                      {application.reviews.map((review, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger>
                            <Link href={`review/${review.id}`}>
                              <Avatar className="border">
                                <AvatarImage
                                  src={review.user.image ?? undefined}
                                />
                              </Avatar>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{review.user.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  );
};
