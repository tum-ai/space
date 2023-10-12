import Dialog from "@/components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ApplicationOverview } from "./applicationOverview";
import { ReviewOverview } from "./reviewOverview";

export function ViewReview({ trigger, viewReview, applicationToView }) {
  return (
    <Dialog trigger={trigger}>
      <DialogClose className="float-right">
        <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
      </DialogClose>
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewOverview review={viewReview} />
        <ApplicationOverview application={applicationToView} />
      </div>
    </Dialog>
  );
}
