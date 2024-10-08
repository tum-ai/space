"use client";

import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { AddUserPopup } from "@components/user/addUserPopup";
import { Person } from "@lib/types/person";
import { Minus, Plus, UserMinus } from "lucide-react";

interface Props {
  users: Person[];
  append: (user: Person) => void;
  remove: (index: number) => void;
  key: string;
}

export const UsersStack = ({ users, append, remove, key }: Props) => {
  return (
    <div className="flex -space-x-3">
      {users.map((user, index) => (
        <Tooltip key={`${key}-${user.id}`}>
          <TooltipTrigger asChild>
            <button
              className="relative inline-block"
              onClick={() => {
                remove(index);
              }}
            >
              <Avatar className="h-10 w-10 ring-2 ring-border transition-colors hover:ring-destructive">
                <span className="absolute flex h-full w-full items-center justify-center bg-destructive/90 text-destructive-foreground opacity-0 transition-opacity hover:opacity-100">
                  <UserMinus />
                </span>
                <AvatarImage src={user.image ?? undefined} />
              </Avatar>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="flex items-center">
              <Minus className="mr-1" /> {user.name}
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
      <AddUserPopup append={append} users={users}>
        <span className="pl-4">
          <Button
            size="icon-sm"
            type="button"
            className="h-10 w-10 rounded-full"
            variant="ghost"
          >
            <Plus />
          </Button>
        </span>
      </AddUserPopup>
    </div>
  );
};
