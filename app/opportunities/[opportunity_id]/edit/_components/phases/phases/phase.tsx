import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import {
  Ellipsis,
  FolderPen,
  Handshake,
  Move,
  Plus,
  Trash,
} from "lucide-react";
import { QuestionnaireDialog } from "../questionnaire/questionnaireDialog";
import { Card } from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { usePhasesContext } from "../usePhasesStore";
import { cn } from "@lib/utils";
import { PhasePopover } from "./phasePopover";
import { AvatarStack } from "@components/user/users-stack";

interface Props {
  index: number;
  className?: string;
}

export default function Phase({ index: phaseIndex, className }: Props) {
  const phase = usePhasesContext((s) => s.phases.at(phaseIndex));
  if (!phase) throw new Error(`Phase does not exist at index ${phaseIndex}`);

  const onRemove = usePhasesContext((s) => s.removePhase);
  const onSave = usePhasesContext((s) => s.updatePhase)(phaseIndex);
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
    <Card className={cn("group w-80", className)}>
      <div className="flex flex-row items-center justify-between p-2">
        <h4 className="flex scroll-m-20 items-center text-xl font-semibold tracking-tight">
          {phase.isInterview && <Handshake className="mr-2 h-6 w-6" />}
          {phase.name}
        </h4>
        <div className="flex flex-row gap-2">
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
                <Move className="mr-2 h-4 w-4" />
                <span>Move</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRemove(phaseIndex)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <PhasePopover onSave={onSave} defaultValues={phase}>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground"
            >
              <FolderPen />
            </Button>
          </PhasePopover>

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

                <AvatarStack
                  users={questionnaire.reviewers}
                  size="sm"
                  maxVisible={5}
                />
              </div>
            </Card>
          </QuestionnaireDialog>
        ))}

        <QuestionnaireDialog onSave={appendQuestionnaire}>
          <Button
            variant="outline"
            className="h-8 w-full py-1 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Plus />
          </Button>
        </QuestionnaireDialog>
      </div>
    </Card>
  );
}
