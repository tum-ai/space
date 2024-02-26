import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { UserAvatar } from "./userAvatar";
import { MenuActions } from "./MenuActions";

export const User = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <MenuActions />
    </DropdownMenu>
  );
};
