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
import { OpportunitySchema } from "@lib/schemas/opportunity";
import { Copy } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ApplicationField } from "@components/application/applicationField";
import { api } from "trpc/react";
import { Tally } from "@lib/types/tally";
import LoadingWheel from "@components/LoadingWheel";
import { ConditionPopover } from "./conditionalPopover";
import { TallyFieldForm } from "./tallyFieldForm";

export const TallyForm = () => {
  const form = useFormContext<z.infer<typeof OpportunitySchema>>();

  const opportunityId = form.getValues().id;

  const { data, isLoading } = api.opportunity.getTallySchema.useQuery({
    id: Number(opportunityId),
  });

  if (isLoading)
    return (
      <div>
        <LoadingWheel />
      </div>
    );

  const applicationFields = (data?.tallySchema as Tally)?.data?.fields ?? [];

  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Tally form
      </h2>
      <p className="text-muted-foreground">
        Create a form in tally that is sent to the applicants
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Webhook url</FormLabel>
              <FormControl>
                <div className="flex w-full gap-2">
                  <Input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/api/tally/opportunity/${field.value}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      toast.promise(
                        navigator.clipboard.writeText(
                          `${window.location.origin}/api/tally/opportunity/${field.value}`,
                        ),
                        {
                          loading: "Copying to clipboard",
                          success: "Copied to clipboard",
                          error: "Failed to copy to clipboard",
                        },
                      );
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
          )}
        />

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Application Form
              </h3>
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
    </div>
  );
};
