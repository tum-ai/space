"use client";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";

const MyReviews = observer(() => {
  const { reviewToolModel } = useStores();
  const myreviews = reviewToolModel.myreviews;
  console.log(myreviews);

  return (
    <ProtectedItem showNotFound roles={["submit_reviews"]}>
      <Section>
        <div className="text-6xl font-thin">My reviews</div>
      </Section>
      <Section>
        <table></table>
      </Section>
    </ProtectedItem>
  );
});

export default MyReviews;
