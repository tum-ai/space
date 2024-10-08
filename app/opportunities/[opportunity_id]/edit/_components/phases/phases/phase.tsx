import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { type z } from "zod";
import { type PhasesSchema } from "@lib/schemas/opportunity";
import { Ellipsis, FolderPen, Move, Plus, Trash, X } from "lucide-react";
import { QuestionnaireDialog } from "../questionnaire/questionnaireDialog";
import { Card } from "@components/ui/card";
import { Phase as PhaseType, Questionnaire } from "@lib/types/opportunity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { usePhasesContext } from "../usePhasesStore";

interface Props {
  index: number;
}

export default function Phase({ index: phaseIndex }: Props) {
  const phase = usePhasesContext((s) => s.phases.at(phaseIndex));
  if (!phase) throw new Error(`Phase does not exist at index ${phaseIndex}`);

  const onRemove = usePhasesContext((s) => s.removePhase);
  const appendQuestionnaire = usePhasesContext((s) => s.appendQuestionnaire)(
    phaseIndex,
  );
  const removeQuestionnaire = usePhasesContext((s) => s.removeQuestionnaire)(
    phaseIndex,
  );
  const updateQuestionnaire = usePhasesContext((s) => s.updateQuestionnaire)(
    phaseIndex,
  );

  return (
    <Card className="group w-80">
      <div className="flex flex-row items-center justify-between p-2">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {phase.name}
        </h4>
        <div className="flex flex-row gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FolderPen className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Move className="mr-2 h-4 w-4" />
                <span>Move</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRemove(phaseIndex)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <QuestionnaireDialog onSave={appendQuestionnaire}>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground"
            >
              <Plus />
            </Button>
          </QuestionnaireDialog>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 p-2">
        {phase.questionnaires.map((questionnaire, index) => (
          <QuestionnaireDialog
            key={questionnaire.id}
            defaultValues={questionnaire}
            onSave={(data) => updateQuestionnaire(index, data)}
            onRemove={() => removeQuestionnaire(index)}
          >
            <Card className="cursor-pointer p-2">
              <div className="flex flex-row justify-between">
                <p>{questionnaire.name}</p>

                <div className="flex -space-x-3 overflow-hidden">
                  {[...questionnaire.reviewers].splice(0, 4).map((reviewer) => (
                    <Tooltip
                      key={`reviewer-${questionnaire.name}-${reviewer.id}`}
                    >
                      <TooltipTrigger>
                        <Avatar className="h-6 w-6 border">
                          <AvatarImage src={reviewer.image ?? undefined} />
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{reviewer.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {questionnaire.reviewers.length > 4 && (
                    <Avatar className="h-6 w-6 border bg-primary-foreground">
                      <AvatarFallback className="text-xs">
                        +{questionnaire.reviewers.length - 4}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </Card>
          </QuestionnaireDialog>
        ))}

        <QuestionnaireDialog onSave={appendQuestionnaire}>
          <Button
            variant="outline"
            className="h-8 w-full py-1 opacity-0 group-hover:opacity-100"
          >
            <Plus />
          </Button>
        </QuestionnaireDialog>
      </div>
    </Card>
  );
}
