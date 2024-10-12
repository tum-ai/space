"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { AddUserPopup } from "@components/user/add-user-popup";
import { cn } from "@lib/utils";
import { cva } from "class-variance-authority";
import { Plus, User, UserMinus } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@components/ui/scroll-area";

export type AvatarStackUser = { id: string } & (
  | { name?: string; image?: string }
  | { name: string | null; image: string | null }
);

type Props<User extends AvatarStackUser> = {
  users: User[];
  maxVisible?: number;
} & (
  | {
      append?: never;
      remove?: never;
    }
  | {
      append: (user: User) => void;
      remove: (index: number) => void;
    }
) &
  VariantProps<typeof userStackVariants>;

const userStackVariants = cva("ring-border", {
  variants: {
    size: {
      default: "h-10 w-10 ring-2",
      sm: "h-6 w-6 ring-1",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const AvatarStack = <User extends AvatarStackUser>({
  users,
  maxVisible,
  append,
  remove,
  size = "default",
}: Props<User>) => {
  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .splice(2)
      .join("");

    return initials;
  };

  return (
    <div
      className={cn(
        "flex",
        size == "sm" && "-space-x-2",
        size == "default" && "-space-x-4",
      )}
    >
      {(maxVisible ? [...users].splice(0, maxVisible) : users)
        .filter((u) => !!u)
        .map((user, index) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              {remove ? (
                <button
                  className="relative inline-block"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <Avatar
                    className={cn(
                      "transition-colors hover:ring-destructive-foreground",
                      userStackVariants({ size }),
                    )}
                  >
                    <span className="absolute flex h-full w-full items-center justify-center bg-destructive/90 text-destructive-foreground opacity-0 transition-opacity hover:opacity-100">
                      <UserMinus />
                    </span>
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <Avatar className={cn(userStackVariants({ size }))}>
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}

      {maxVisible && users.length > maxVisible && (
        <Tooltip>
          <TooltipTrigger>
            <Avatar className={cn(userStackVariants({ size }))}>
              <AvatarFallback className="text-xs">
                +{users.length - maxVisible}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <ScrollArea className="flex h-64 overflow-y-auto">
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 text-sm"
                  >
                    <Avatar>
                      <AvatarImage src={user.image ?? undefined} />
                    </Avatar>
                    {user.name}
                  </div>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </TooltipContent>
        </Tooltip>
      )}

      {append && (
        <AddUserPopup append={append} users={users}>
          <span className={cn(users.length && "pl-4")}>
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
      )}
    </div>
  );
};
