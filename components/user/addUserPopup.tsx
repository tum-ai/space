import { Button } from "@components/ui/button";
import { ChevronsUpDown, UserPlus } from "lucide-react";
import { api } from "trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
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
  CommandList,
} from "@components/ui/command";
import { Person } from "@lib/types/person";

interface Props {
  append: (person: Person) => void;
  users: Person[];
}

export const AddUserPopup = ({ append, users }: Props) => {
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
          Add user
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <Command>
          <CommandInput placeholder="Search member" />
          <CommandEmpty>No users found</CommandEmpty>
          <CommandList>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {data
                ?.filter((member) => {
                  const userIds = users.map((user) => user.id);
                  return !userIds.includes(member.id);
                })
                ?.map((member) => (
                  <CommandItem
                    key={member.id}
                    value={member.name ?? ""}
                    onSelect={() => {
                      append({
                        id: member.id,
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
