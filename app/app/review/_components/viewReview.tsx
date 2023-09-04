import { ReviewOverview } from "./reviewOverview";
import { ApplicationOverview } from "./applicationOverview";
import Dialog from "@components/Dialog";

export function ViewReview({ trigger, viewReview, applicationToView }) {
  return (
    <Dialog trigger={trigger}>
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewOverview review={viewReview} />
        <ApplicationOverview data={applicationToView} />
      </div>
    </Dialog>
  );
}
