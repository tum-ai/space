import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoaderCircle className="h-24 w-24 animate-spin" />
    </div>
  );
}
