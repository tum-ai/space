<<<<<<< HEAD:app/src/app/not-found.tsx
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
=======
import { Button } from "@components/ui/button";
import { Section } from "@components/Section";
>>>>>>> dev:app/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <Section className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl">Ups, looks like you are lost..</h1>
      <Link href={"/"}>
        <Button>return home</Button>
      </Link>
    </Section>
  );
}
