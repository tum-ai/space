import Dialog from "@/components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Review } from "@models/review";
import { ApplicationOverview } from "./applicationOverview";
import { ReviewFormComponent } from "../[form_type]/[application_id]/components/ReviewForm";

interface EditReviewProps {
  review: Review;
  trigger: React.ReactNode;
}

export function EditReview({ review, trigger }: EditReviewProps) {
  const form = review?.form;
  return (
    <Dialog trigger={trigger}>
      <DialogClose className="float-right">
        <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
      </DialogClose>
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewFormComponent application={review.application} form={form} />
        <ApplicationOverview application={review.application} />
      </div>
    </Dialog>
  );
}
