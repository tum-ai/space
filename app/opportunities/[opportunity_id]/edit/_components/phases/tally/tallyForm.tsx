"use client";

import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { PhasesSchema } from "@lib/schemas/opportunity";
import { Copy } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "trpc/react";
import { Tally } from "@lib/types/tally";
import { TallyFieldForm } from "./tallyFieldForm";
import { useEffect, useState } from "react";

export const TallyForm = () => {
  const form = useFormContext<z.infer<typeof PhasesSchema>>();

  const opportunityId = form.getValues().opportunityId;

  const { data } = api.opportunity.getTallySchema.useQuery({
    id: Number(opportunityId),
  });

  const applicationFields = (data?.tallySchema as Tally)?.data?.fields ?? [];
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(
        `${window.location.origin}/api/tally/opportunity/${form.getValues("opportunityId")}`,
      );
    }
  }, []);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <FormItem className="w-full">
        <FormLabel>Webhook url</FormLabel>
        <FormControl>
          <div className="flex w-full gap-2">
            <Input type="text" readOnly value={webhookUrl} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                toast.promise(navigator.clipboard.writeText(webhookUrl), {
                  loading: "Copying to clipboard",
                  success: "Copied to clipboard",
                  error: "Failed to copy to clipboard",
                });
              }}
            >
              <Copy />
            </Button>
          </div>
        </FormControl>
        <FormDescription>
          Set this Webhook url in Tally to receive the applications
        </FormDescription>
        <FormMessage />
      </FormItem>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Application Form
          </CardTitle>
          {applicationFields.length === 0 && (
            <CardDescription>
              Your application schema will show up here once you submit a test
              application
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="sticky grid gap-12">
            {applicationFields.map((field) => (
              <TallyFieldForm key={field.key} field={field} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
