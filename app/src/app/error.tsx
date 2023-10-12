"use client";

import { useEffect } from "react";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <h1>Something went wrong!</h1>
      <Button onClick={() => reset()}>Try again</Button>
    </Section>
  );
}
