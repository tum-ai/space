import { Button } from "@components/ui/button";
import { Section } from "@components/Section";
import Link from "next/link";

export default function NotFound() {
  return (
    <Section className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl">Ups, looks like you are lost..</h1>
      <Button asChild>
        <Link href={"/"}>return home</Link>
      </Button>
    </Section>
  );
}
