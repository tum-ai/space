import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default function MembersPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Members list
        </h1>
        <p className="text-muted-foreground">Manage and list members</p>
      </div>
    </div>
  );
}
