import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ReviewForm } from "../[id]/_components/ReviewForm";
import { ApplicationOverview } from "./applicationOverview";

export function EditReview({ review, trigger, applicationToView }) {
  const form = review?.form;
  return (
    <Dialog trigger={trigger}>
      <DialogClose className="float-right">
        <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
      </DialogClose>
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewForm application={applicationToView} form={form} />
        <ApplicationOverview application={applicationToView} />
      </div>
    </Dialog>
  );
}
