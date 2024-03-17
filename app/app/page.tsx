import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 pt-[50%] text-center sm:pt-40">
      <Rocket className="h-20 w-20" />

      <div>
        <h1 className="mb-4 scroll-m-20 text-6xl font-extrabold tracking-tight">
          Space
        </h1>
        <p className="text-muted-foreground">
          “He who controls the spice controls the universe.”
        </p>
      </div>
    </div>
  );
}
