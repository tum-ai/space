import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { Ellipsis, FolderPen, Handshake, Plus, Trash } from "lucide-react";
import { QuestionnaireDialog } from "../questionnaire/questionnaireDialog";
import { Card } from "@components/ui/card";
import { usePhasesContext } from "../usePhasesStore";
import { cn } from "@lib/utils";
import { PhasePopover } from "./phasePopover";
import { AvatarStack } from "@components/user/users-stack";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: phase.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      className={cn("group w-80 cursor-default", className)}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="flex flex-row items-center justify-between p-2">
        <h4
          className="flex flex-1 cursor-pointer scroll-m-20 items-center text-xl font-semibold tracking-tight"
          ref={setActivatorNodeRef}
          {...listeners}
        >
          {phase.isInterview && <Handshake className="mr-2 h-6 w-6" />}
          {phase.name}
        </h4>
        <div className="flex flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-max flex-col p-1">
              <PhasePopover onSave={onSave} defaultValues={phase} align="start">
                <Button
                  onSelect={(e) => e.preventDefault()}
                  variant="ghost"
                  className="h-max justify-start px-2 py-1.5"
                  size="sm"
                >
                  <FolderPen className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </PhasePopover>

              <Button
                onClick={() => onRemove(phaseIndex)}
                variant="ghost"
                className="h-max justify-start px-2 py-1.5"
                size="sm"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </Button>
            </PopoverContent>
          </Popover>

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
