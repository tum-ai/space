import { type ClassValue, clsx } from "clsx";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapPathnameToBreadcrumbs(
  headerList: ReadonlyHeaders,
): { label: string; href: string }[] {
  const pathname = headerList.get("x-current-path");
  if (!pathname) return [];

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = isNaN(Number(segment)) ? segment : `${segment}`;
    return { label, href };
  });

  return breadcrumbs;
}
