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
import { cn } from "@lib/utils";
import { usePhasesContext } from "../phases/usePhasesStore";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@components/ui/button";

export const SelectQuestionnaireCombobox = ({
  value,
  setValue,
  className,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) => {
  const phases = usePhasesContext((s) => s.phases);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between truncate"
        >
          {value
            ? phases
                .flatMap((p) => p.questionnaires)
                .find((q) => q.id === value)?.name
            : "Questionnaire..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)}>
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
                      setValue(currentValue);
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
  );
};
