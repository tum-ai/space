import { Button } from "@components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl">Looks like you are lost..</h1>
      <Link href={"/"}>
        <Button variant="link" className="flex gap-2">
          Return home
        </Button>
      </Link>
    </section>
  );
}
