import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./breadcrumb";

type PageBreadcrumb = { href: string; label: string };

export interface Props {
  breadcrumbs: PageBreadcrumb[];
  className?: string;
}

export const PageBreadcrumbs = ({ breadcrumbs, className }: Props) => {
  const capitalizeFirstChar = (str: string) => {
    if (!str) return str;
    return isNaN(Number(str.charAt(0)))
      ? str.charAt(0).toUpperCase() + str.slice(1)
      : str;
  };

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map(({ href, label }, index) => (
          <>
            <BreadcrumbSeparator key={`separator-${href}`} />

            <BreadcrumbItem>
              <BreadcrumbLink
                key={href}
                asChild
                className="max-w-20 truncate md:max-w-none"
              >
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{capitalizeFirstChar(label)}</BreadcrumbPage>
                ) : (
                  <Link href={href}>{capitalizeFirstChar(label)}</Link>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
