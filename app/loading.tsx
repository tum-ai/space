import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex w-full items-center justify-center">
      <LoaderCircle className="mt-64 h-32 w-32 animate-spin" />
    </div>
  );
}
