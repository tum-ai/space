import { Button } from "@components/ui/button";
import { ChevronsUpDown, UserPlus } from "lucide-react";
import { api } from "trpc/react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { UseFieldArrayAppend } from "react-hook-form";
import { QuestionnaireSchema } from "@lib/schemas/opportunity";
import { useState } from "react";
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
} from "@components/ui/command";

interface AddReviewerPopupProps {
  append: UseFieldArrayAppend<z.infer<typeof QuestionnaireSchema>, "reviewers">;
}
export const AddReviewerPopup = ({ append }: AddReviewerPopupProps) => {
  const { data } = api.user.getAll.useQuery();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full"
        >
          <UserPlus className="mr-2" />
          Add reviewer
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <Command>
          <CommandEmpty>No users found</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {data?.map((member) => (
              <CommandItem
                key={member.id}
                value={member.name ?? ""}
                onSelect={() => {
                  append({
                    ...member,
                    name: member.name ?? undefined,
                    image: member.image ?? undefined,
                  });
                  setOpen(false);
                }}
              >
                <div className="flex w-full items-center gap-6">
                  <Avatar>
                    <AvatarImage src={member.image ?? undefined} />
                    <AvatarFallback>{member.name}</AvatarFallback>
                  </Avatar>
                  <h3>{member.name}</h3>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandInput placeholder="Search member" />
        </Command>
      </PopoverContent>
    </Popover>
  );
};
