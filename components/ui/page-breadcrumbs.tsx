import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./breadcrumb";
import { Fragment } from "react";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import db from "server/db";

export async function mapPathnameToBreadcrumbs(
  headerList: ReadonlyHeaders,
): Promise<{ label: string; href: string }[]> {
  const pathname = headerList.get("x-current-path");
  if (!pathname) return [];

  const segments = pathname.split("/").filter(Boolean);

  const getLabelForNumberSegment = async (
    segment: string,
    index: number,
  ): Promise<PageBreadcrumb["label"]> => {
    const previousSegment = segments[index - 1];

    if (previousSegment == "opportunities") {
      return await db.opportunity
        .findUnique({
          where: { id: Number(segment) },
        })
        .then((e) => e?.title ?? segment);
    }

    if (previousSegment === "application") {
      return await db.application
        .findUnique({
          where: { id: Number(segment) },
        })
        .then((e) => e?.name ?? segment);
    }

    return segment;
  };

  return (
    await Promise.all(
      segments.map(async (segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = isNaN(Number(segment))
          ? segment
          : await getLabelForNumberSegment(segment, index);

        return { label, href };
      }),
    )
  ).map((e) => {
    console.log(e);
    return e;
  }) as PageBreadcrumb[];
}

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
          <Fragment key={href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
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
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
