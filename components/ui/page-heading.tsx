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
    <div className="flex flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-3 truncate">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
