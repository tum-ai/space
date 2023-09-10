"use client";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import { MembershipReviewForm } from "./MembershipReviewForm";
import { VentureReviewForm } from "./VentureReviewForm";


export const ReviewForm = observer(() => {
    const { reviewToolModel } = useStores();
    const formType = reviewToolModel.formType;

    let reviewFormComponent = <p>No form type selected.</p>;
    if (formType == "MEMBERSHIP") {
        reviewFormComponent = <MembershipReviewForm />;
    }
    if (formType == "VENTURE") {
        reviewFormComponent = <VentureReviewForm />;
    }

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
                }} />
            {reviewFormComponent}
        </div>
    );
});

