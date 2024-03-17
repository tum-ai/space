import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { MenuActions } from "./menuActions";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Session } from "next-auth";

interface UserProps {
  user: Session["user"];
}

export const UserComponent = ({ user }: UserProps) => {
  const extractInitials = (name: string): string => {
    // Split the name into individual words
    const words = name.split(" ");

    // Extract the first letter of each word and join them
    const initials = words.map((word) => word.charAt(0)).join("");

    return initials.toUpperCase(); // Convert to uppercase for consistency
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center space-x-4 rounded-full bg-background sm:p-3">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{extractInitials(user.name ?? "")}</AvatarFallback>
          </Avatar>
          <p className="hidden pr-3 sm:flex">{user.name}</p>
        </div>
      </DropdownMenuTrigger>
      <MenuActions user={user} />
    </DropdownMenu>
  );
};
