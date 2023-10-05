"use client";
import { Section } from "@components/Section";
import { Applications } from "../components/applications";

const ReviewTool = ({ params }) => (
  <Section>
    <Applications formType={decodeURIComponent(params.form_type)} />
  </Section>
);

export default ReviewTool;
