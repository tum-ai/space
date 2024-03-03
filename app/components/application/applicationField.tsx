import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Tally } from "@lib/types/tally";
import { format } from "date-fns";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Textarea } from "@components/ui/textarea";
import { Checkbox } from "@components/ui/checkbox";
import { FileText, X } from "lucide-react";

interface ApplicationFieldProps {
  field: Tally["data"]["fields"][number];
}

const ApplicationValue = ({ field }: ApplicationFieldProps) => {
  if (!field.value)
    return (
      <div className="flex w-full items-center justify-center gap-2 px-3 py-2 text-sm">
        <X />
        <p>No value</p>
      </div>
    );

  switch (field.type) {
    case "CHECKBOXES":
      if (Array.isArray(field.value)) {
        return (
          <div className="mt-3">
            {field.options!.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={
                    !!(field.value as string[]).find(
                      (value) => value === option.id,
                    )
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none"
                >
                  Accept terms and conditions
                </label>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="mt-3 flex items-center space-x-2">
          <Checkbox id="terms" checked={field.value} />
          <label htmlFor="terms" className="text-sm font-medium leading-none">
            Check
          </label>
        </div>
      );

    case "DROPDOWN":
      const value = field.options?.find((opt) => opt.id === field.value?.at(0));
      if (value) {
        return (
          <Select value={value.id}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{field.label}</SelectLabel>
                {field.options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      }

    case "TEXTAREA":
      return <Textarea>{field.value}</Textarea>;

    case "INPUT_TEXT":
      return <Input readOnly value={field.value} />;

    case "INPUT_DATE":
      return <Input readOnly value={format(new Date(field.value), "PPP")} />;

    case "INPUT_LINK":
      return (
        <Button asChild variant="outline">
          <Link href={field.value}>{field.value}</Link>
        </Button>
      );

    case "INPUT_EMAIL":
      return (
        <Button asChild variant="outline">
          <Link href={`mailto:${field.value}`}>Send mail to {field.value}</Link>
        </Button>
      );

    case "FILE_UPLOAD":
      return (
        <div>
          {field.value.map((value) => (
            <Button key={value.id} asChild variant="outline" className="w-full">
              <Link href={value.url} target="_blank">
                <FileText className="mr-2" />
                {value.name}
              </Link>
            </Button>
          ))}
        </div>
      );
  }
};

export const ApplicationField = ({ field }: ApplicationFieldProps) => (
  <div className="flex flex-col gap-2">
    <Label>{field.label}</Label>
    <ApplicationValue field={field} />
  </div>
);
