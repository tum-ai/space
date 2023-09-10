"use client";
import Select from "@components/Select";
import { MembershipReviewForm } from "./MembershipReviewForm";
import { VentureReviewForm } from "./VentureReviewForm";
import { Application } from "@models/application";
import { useState } from "react";

export interface FormProps {
  application: Application;
}
export const ReviewForm = ({ application }: FormProps) => {
  const [formType, setFormType] = useState(
    application.submission.data.formName,
  );

  const forms = {
    MEMBERSHIP: <MembershipReviewForm application={application} />,
    VENTURE: <VentureReviewForm application={application} />,
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
        setSelectedItem={(item) => setFormType(item)}
      />
      {reviewFormComponent}
    </div>
  );
};
