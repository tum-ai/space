import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ReviewFormComponent } from "../review/_components/ReviewForm";
import { ApplicationOverview } from "./applicationOverview";
import { Review } from "@models/review";

interface EditReviewProps {
  review: Review;
  trigger: React.ReactNode;
}

export function EditReview({ review, trigger }: EditReviewProps) {
  console.log(review);
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
