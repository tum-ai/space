"use client";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import { MembershipReviewForm } from "./MembershipReviewForm";
import { VentureReviewForm } from "./VentureReviewForm";

export const ReviewForm = observer(() => {
  const { reviewToolModel } = useStores();
  const formType = reviewToolModel.formType;

  const forms = {
    MEMBERSHIP: <MembershipReviewForm />,
    VENTURE: <VentureReviewForm />,
  };

  let reviewFormComponent = forms[formType];

  return (
    <div className="flex flex-col gap-8">
      <Select
        label="Choose review type"
        placeholder="From Type"
        options={[
          {
            key: "Membership review",
            value: "MEMBERSHIP",
          },
          {
            key: "Venture review",
            value: "VENTURE",
          },
        ]}
        value={formType}
        setSelectedItem={(item) => {
          reviewToolModel.setFormType(item);
        }}
      />
      {reviewFormComponent}
    </div>
  );
});