"use client";

import { Button } from "@components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { api } from "trpc/react";

interface Props {
  opportunityId: number;
}

export const AssignQuestionnaireButton = ({ opportunityId }: Props) => {
  const mutation =
    api.application.reassignAllApplicationsToQuestionnaires.useMutation();

  return (
    <Button
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        const toastId = toast.loading("Reassign questionnaires...");
        try {
          await mutation.mutateAsync({ opportunityId });
          toast.success("Reassigned questionnaires", { id: toastId });
        } catch (err) {
          toast.error("Failed to reassign questionnaires", { id: toastId });
        }
      }}
    >
      <RotateCcw className="mr-2" />
      Reassign
    </Button>
  );
};
