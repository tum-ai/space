import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { MenuActions } from "./menuActions";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { type Session } from "next-auth";

interface UserProps {
  user: Session["user"];
}

export const UserComponent = ({ user }: UserProps) => {
  const extractInitials = (name: string): string => {
    // Split the name into individual words
    const words = name.split(" ");

    // Extract the first letter of each word and join them
    const initials = words
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2);
    return initials.toUpperCase(); // Convert to uppercase for consistency
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>{extractInitials(user.name ?? "")}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <MenuActions user={user} />
    </DropdownMenu>
  );
};
