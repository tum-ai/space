"use client";
import { Section } from "@components/Section";
import { Button } from "@components/ui/button";
import { Card, CardFooter, CardHeader } from "@components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const ReviewPage = () => {
  const formTypesQuery = useQuery({
    queryKey: ["applications", "info"],
    queryFn: () =>
      axios.get("/applications/info").then((res) => res.data.data as string[]),
  });

  return (
    <Section>
      <div className="grid grid-cols-2 gap-4">
        {formTypesQuery.data &&
          formTypesQuery.data.map((formType) => (
            <Card key={`form_type_${formType}`}>
              <CardHeader>{formType}</CardHeader>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/review/${formType}`}>View Applications</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </Section>
  );
};

export default ReviewPage;
