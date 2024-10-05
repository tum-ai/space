import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { TallyField } from "@lib/types/tally";
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
import { FormLabel } from "@components/ui/form";
import { cn } from "@lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Badge } from "@components/ui/badge";
import { Slider } from "@components/ui/slider";

interface ApplicationFieldProps {
  field: TallyField;
  className?: string;
  index?: number;
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
          <div className="space-y-2">
            {field.options!.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  disabled
                  checked={
                    !!(field.value as string[]).find(
                      (value) => value === option.id,
                    )
                  }
                />
                <label htmlFor="terms" className="text-sm leading-none">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="flex items-center space-x-2">
          <Checkbox disabled checked={field.value} />
          <label htmlFor="terms" className="text-sm leading-none">
            Accept
          </label>
        </div>
      );

    case "DROPDOWN":
      const value = field.options?.find((opt) => opt.id === field.value?.at(0));
      if (value) {
        return (
          <Select disabled value={value.id}>
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

    case "MULTIPLE_CHOICE":
      const selected_value = field.options?.find(
        (opt) => opt.id === field.value?.at(0),
      );
      if (selected_value) {
        return <p className="text-sm">{selected_value.text}</p>;
      }

      return <p>No value</p>;

    case "TEXTAREA":
      return <Textarea readOnly defaultValue={field.value} />;

    case "INPUT_TEXT":
      return <Input readOnly value={field.value} />;

    case "INPUT_NUMBER":
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

    case "MATRIX":
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]" />
              {field.columns.map((col) => (
                <TableHead>{col.text}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {field.rows.map((row) => (
              <TableRow key={`row-${row.id}`}>
                <TableHead>{row.text}</TableHead>
                {field.columns.map((col) => (
                  <TableCell key={`row-${row.id}-col-${col.id}`}>
                    <Checkbox
                      disabled
                      checked={field.value[row.id]?.includes(col.id)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );

    case "LINEAR_SCALE":
      const scaleValue = [Number(field.value)];
      return (
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="flex items-center justify-center">
            <span className="font-bold">{scaleValue}</span>
          </div>
          <Slider value={scaleValue} max={7} />
        </div>
      );
  }
};

export const ApplicationField = ({
  field,
  className,
  index,
}: ApplicationFieldProps) => (
  <div className="flex w-full items-start gap-4">
    {index && <Badge variant="secondary">{index}</Badge>}
    <div className={cn("flex flex-col gap-3", className)}>
      {!!field.label && <FormLabel>{field.label}</FormLabel>}
      <ApplicationValue field={field} />
    </div>
  </div>
);
