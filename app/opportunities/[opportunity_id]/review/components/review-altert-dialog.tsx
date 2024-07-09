"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { revalidate } from "@lib/revalidate";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "trpc/react";

export const DeleteAlertDialog = ({
  inputReviewId,
  inputOpportunityId,
}: {
    inputReviewId: number;
    inputOpportunityId: number;
}) => {
  const deleteMutation = api.review.deleteById.useMutation();
  const router = useRouter();

  const handleDelete = () => {
    toast.promise(
      deleteMutation.mutateAsync({ id: inputReviewId }).then(() => {
        revalidate(`/opportunities/${inputOpportunityId}/review`);
        router.push(`/opportunities/${inputOpportunityId}/review`);
      }),
      {
        loading: "deleting review",
        success: "Review deleted",
        error: "Failed to save review",
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 className="text-red-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            review.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
