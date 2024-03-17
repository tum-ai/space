import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { UserPlus } from "lucide-react";
import { api } from "trpc/react";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { UseFieldArrayAppend } from "react-hook-form";
import { QuestionnaireSchema } from "@lib/schemas/opportunity";

interface AddReviewerPopupProps {
  append: UseFieldArrayAppend<z.infer<typeof QuestionnaireSchema>, "reviewers">;
}
export const AddReviewerPopup = ({ append }: AddReviewerPopupProps) => {
  const { data, isLoading } = api.user.getAll.useQuery();

  return (
    <Dialog>
      <Button className="w-full" variant="secondary" type="button" asChild>
        <DialogTrigger>
          <UserPlus className="mr-2" />
          Add reviewer
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add reviewer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && <p>Loading...</p>}
          {data?.map((user) => {
            const member = {
              ...user,
              name: user.name ?? undefined,
              image: user.image ?? undefined,
            };

            return (
              <DialogClose asChild key={member.id}>
                <Button
                  className="w-full py-8"
                  variant="outline"
                  onClick={() => {
                    append(member);
                  }}
                >
                  <div className="flex w-full items-center gap-6">
                    <Avatar>
                      <AvatarImage src={member.image} />
                      <AvatarFallback>{member.name}</AvatarFallback>
                    </Avatar>
                    <h3>{member.name}</h3>
                  </div>
                </Button>
              </DialogClose>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
