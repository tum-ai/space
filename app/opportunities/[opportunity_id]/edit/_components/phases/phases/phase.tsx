import {
  type UseFieldArrayRemove,
  type UseFieldArrayUpdate,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { type z } from "zod";
import { type PhasesSchema } from "@lib/schemas/opportunity";
import { Ellipsis, FolderPen, Move, Plus, Trash, X } from "lucide-react";
import { QuestionnaireDialog } from "../questionnaire/questionnaireDialog";
import { Card } from "@components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";

interface Props {
  index: number;
  phase: z.infer<typeof PhasesSchema>["phases"][number];
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<z.infer<typeof PhasesSchema>, "phases">;
}

export default function Phase({ index, phase, remove: removePhase }: Props) {
  const form = useFormContext<z.infer<typeof PhasesSchema>>();
  const {
    fields: questionaires,
    append,
    remove,
    update,
  } = useFieldArray({
    keyName: `fieldId`,
    control: form.control,
    name: `phases.${index}.questionnaires`,
  });

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
              <DropdownMenuItem onClick={() => removePhase(index)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <QuestionnaireDialog onSave={(data) => append(data)}>
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
        {questionaires.map((questionnaire, index) => (
          <QuestionnaireDialog
            key={questionnaire.id}
            defaultValues={questionnaire}
            onSave={(data) => update(index, data)}
            onRemove={() => remove(index)}
          >
            <Card className="cursor-pointer p-2">
              <div className="flex flex-row justify-between">
                <p>{questionnaire.name}</p>

                <div className="flex -space-x-3 overflow-hidden">
                  {questionnaire.reviewers.splice(0, 5).map((reviewer) => (
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
                </div>
              </div>
            </Card>
          </QuestionnaireDialog>
        ))}

        <QuestionnaireDialog onSave={(data) => append(data)}>
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
