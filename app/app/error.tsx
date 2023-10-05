"use client";

import { Button } from "@components/ui/button";
import { Section } from "@components/Section";
import { useEffect } from "react";

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
