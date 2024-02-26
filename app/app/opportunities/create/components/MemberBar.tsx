import Tag from "@components/Tag";
import { Card } from "@components/ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Member } from "./general";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { UseFieldArrayAppend } from "react-hook-form";
import { FullFormSchema } from "../schema";
import { z } from "zod";

interface MemberBarProps {
  member: Member;
  onDelete?: () => void;
}

export const MemberBar = ({ member, onDelete }: MemberBarProps) => {
  return (
    <Card className="flex items-center justify-between px-4 py-3 shadow">
      <div className="flex items-center gap-6">
        {member.image && (
          <Image
            src={member.image}
            alt={`Image of ${member.name}`}
            width={40}
            height={40}
            className="rounded-md"
          />
        )}
        <div className="flex items-center gap-2 truncate">
          <h2 className="text-md">{member.name}</h2>
          {member.tags?.map((tag) => {
            return <Tag key={tag.text} text={tag.text} color={tag.color} />;
          })}
        </div>
      </div>
      {onDelete && (
        <Button size="icon" onClick={onDelete} variant="ghost">
          <TrashIcon width={24} height={24} />
        </Button>
      )}
    </Card>
  );
};

interface AddMemberBarProps {
  children: React.ReactNode;
  append: UseFieldArrayAppend<
    z.infer<typeof FullFormSchema>,
    "generalInformation.admins"
  >;
}
export function AddMemberBar({ children, append }: AddMemberBarProps) {
  return (
    <Dialog>
      <Button variant="outline" asChild>
        <DialogTrigger>{children}</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add admin</DialogTitle>
          <DialogDescription>
            Admins can configure and manage opportunities
          </DialogDescription>
          <Button
            onClick={() =>
              append({ id: "asd", name: "aa", image: "", tags: [] })
            }
          >
            Add
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
