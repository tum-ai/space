import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoaderCircle className="h-32 w-32 animate-spin" />
    </div>
  );
}
