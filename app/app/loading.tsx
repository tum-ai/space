import { Section } from "@components/Section";

export default function Loading() {
  return (
    <Section>
      <div className="m-auto h-12 w-12 animate-spin rounded-full border-l-2 border-black dark:border-white"></div>
    </Section>
  );
}
