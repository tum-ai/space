"use client";
import Select from "@/components/Select";
import { MembershipReviewForm } from "./MembershipReviewForm";
import { VentureReviewForm } from "./VentureReviewForm";
import { Application } from "@models/application";
import { useState } from "react";
import { ReviewForm } from "@models/review";

export interface FormProps {
  application: Application;
  form?: ReviewForm;
}
export const ReviewFormComponent = ({ application, form }: FormProps) => {
  const formNames = {
    "TUM.ai Application WS23": "MEMBERSHIP",
  };
  const [formType, setFormType] = useState(
    formNames[application.submission.data.formName],
  );

  const forms = {
    MEMBERSHIP: <MembershipReviewForm application={application} form={form} />,
    VENTURE: <VentureReviewForm application={application} form={form} />,
  };

  let reviewFormComponent = forms[formType];

  return (
    <div className="h-full">
      <div className="top-0 flex flex-col gap-8 md:sticky">
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
    </div>
  );
};
