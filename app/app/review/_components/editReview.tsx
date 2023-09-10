import { useStores } from "@providers/StoreProvider";
import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ApplicationOverview } from "./applicationOverview";
import { ReviewOverview } from "./reviewOverview";

import { Review } from "../page";
import { useEffect } from "react";

export function EditReview({ trigger, viewReview, applicationToView }) {
  return (
    <Dialog trigger={trigger}>
      <DialogClose className="float-right">
        <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
      </DialogClose>
      <Review />
    </Dialog>
  );
}
