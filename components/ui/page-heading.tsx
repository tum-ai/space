import {
  PageBreadcrumbs,
  type Props as BreadcrumbProps,
} from "./page-breadcrumbs";

interface Props extends BreadcrumbProps {
  title: string;
  description?: string;
  breadcrumbs: { href: string; label: string }[];
  children?: React.ReactNode;
}

export const PageHeading = ({
  breadcrumbs,
  description,
  title,
  children,
}: Props) => {
  return (
    <div className="mt-14 flex flex-col gap-1 sm:mt-0">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
        <div className="flex w-full flex-col gap-1 truncate">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
