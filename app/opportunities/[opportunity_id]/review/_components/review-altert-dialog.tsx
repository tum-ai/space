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
import { Button } from "@components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "trpc/react";

export const DeleteAlertDialog = ({
  inputReviewId,
  inputOpportunityId,
  children,
}: {
  inputReviewId: number;
  inputOpportunityId: number;
  children?: React.ReactNode;
}) => {
  const deleteMutation = api.review.deleteById.useMutation();
  const router = useRouter();

  const handleDelete = () => {
    toast.promise(
      deleteMutation.mutateAsync({ id: inputReviewId }).then(() => {
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
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
