import { Button } from "@components/ui/button";
import { Rabbit } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <div>
        <div className="flex flex-col items-center text-muted-foreground">
          <Rabbit className="mb-8 h-16 w-16" />
          <p>Page not found</p>
        </div>
        <Button variant="link" className="flex gap-2" asChild>
          <Link href={"/"}>Return home</Link>
        </Button>
      </div>
    </section>
  );
}
