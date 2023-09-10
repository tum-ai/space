"use client";
import { Button } from "@components/Button";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Tabs from "@components/Tabs";
import { observer } from "mobx-react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Review } from "./Review";
import { Applications } from "./Applications";
import { useState } from "react";

const ReviewTool = observer(() => {
  const [openTab, setOpenTab] = useState("Applications");

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
        <Tabs
          tabs={{
            Applications: <Applications />,
            Review: <Review />,
          }}
          value={openTab}
          onValueChange={(tab) => {
            setOpenTab(tab);
          }}
        />
      </Section>
    </ProtectedItem>
  );
});

export default ReviewTool;
