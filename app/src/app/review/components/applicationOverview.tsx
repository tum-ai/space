import { Application } from "@models/application";
import { TallyField, TallyFileUpload } from "@models/tally";
import Link from "next/link";

interface Props {
  application: Application;
}
export const ApplicationOverview = ({ application }: Props) => {
  return (
    <div className="space-y-4 pb-16">
      <div className="col-span-2 text-2xl">Application</div>

      <hr className="border-2 border-black dark:border-white" />

      <dl className="grid gap-x-4 gap-y-8 lg:grid-cols-2">
        <div>
          <dt className="mb-1 text-sm font-thin text-gray-500">ID:</dt>
          <dd>{application.id}</dd>
        </div>

        <div>
          <dt className="mb-1 text-sm font-thin text-gray-500">From:</dt>
          <dd>{application.submission?.data?.formName}</dd>
        </div>

        <div>
          <dt className="mb-1 text-sm font-thin text-gray-500">Created at:</dt>
          <dd>
            {application.submission?.data?.createdAt &&
              new Date(application.submission?.data?.createdAt).toDateString()}
          </dd>
        </div>

        {application.submission?.data?.fields
          ?.sort((fieldA) => {
            if (typeof fieldA.value == "boolean") {
              return -1;
            }
          })
          .filter(
            (field: TallyField) => {
              return field.value && field.type !== "CHECKBOXES" && field.value !== ".";
            },
          )
          .map((field: TallyField) => (
            <TallyFieldComp field={field} key={field.key} />
          ))}
      </dl>
    </div>
  );
};

interface TallyFieldCompProps {
  field: TallyField;
}
const TallyFieldComp = ({ field }: TallyFieldCompProps) => {
  if (field.type === "INPUT_LINK") {
    const fieldValue = field.value as string;
    const redirectLink =
      fieldValue.startsWith("https://") || fieldValue.startsWith("http://")
        ? fieldValue
        : `https://${fieldValue}`;

    return (
      <div>
        <Link className="text-blue-500 underline" href={redirectLink}>
          {field.label}
        </Link>
      </div>
    );
  }

  if (field.type === "FILE_UPLOAD") {
    const fieldValue = field.value.at(0) as unknown as TallyFileUpload;
    return (
      <div>
        <Link className="text-blue-500 underline" href={fieldValue.url}>
          {field.label}
        </Link>
      </div>
    );
  }

  if (field.type === "MULTIPLE_CHOICE" || field.type === "DROPDOWN") {
    return (
      <div>
        <dt className="mb-1 text-sm font-thin text-gray-500">{field.label}</dt>
        <dd>
          {(field.value as string[]).map(
            (value) =>
              field.options.find((option) => option.id === value)?.text,
          )}
        </dd>
      </div>
    );
  }

  return (
    <div className={field.type === "TEXTAREA" && "col-span-2"}>
      <dt className="mb-2 text-sm font-thin text-gray-500">{field.label}</dt>
      <dd>{field.value as string}</dd>
    </div>
  );
};