"use client";
import { Button } from "@/components/Button";
import ProtectedItem from "@/components/ProtectedItem";
import { Section } from "@/components/Section";
import { observer } from "mobx-react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Applications } from "./Applications";

const ReviewTool = observer(() => {
  return (
    <ProtectedItem showNotFound roles={["submit_reviews"]}>
      <Section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-6xl font-thin">Review Tool</h1>
        <Button asChild className="flex w-max items-center gap-2">
          <Link href={"/review/myreviews"}>
            <MagnifyingGlassIcon /> My Reviews
          </Link>
        </Button>
      </Section>

      <Section>
        <Applications />
      </Section>
    </ProtectedItem>
  );
});

export default ReviewTool;
