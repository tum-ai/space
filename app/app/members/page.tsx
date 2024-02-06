import { Metadata } from "next";

import { DataTable } from "./components/DataTable";
import { Section } from "@components/Section";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Members",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default function MembersPage() {
  return (
    <>
      <Section>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of all members.
              </p>
            </div>
          </div>
          <DataTable></DataTable>
        </div>
      </Section>
    </>
  );
}
