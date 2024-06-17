"use client";

import { useParams, usePathname } from "next/navigation";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@components/ui/breadcrumbs-components";
import React from "react";



interface Breadcumb {
  displayName: string;
  path: string;
}

export default function Breadcrumbs({ title, opportunityTitle }: { title: string, opportunityTitle?: string}) {
  const paths = usePathname().split("/").filter(Boolean).slice(0, -1);
  const pathParams = useParams();

  const originalPaths = usePathname().split("/").filter(Boolean).slice(0, -1);

  const breadcrumbs: Breadcumb[] = paths.map((path) => ({ displayName: path.slice(0, 1).toUpperCase() + path.slice(1), path: path }));

  // next doesnt expose the static path in the pathname, we therefore have to match it manually
  if (paths.includes("opportunities") && "opportunity_id" in pathParams) {
    const opportunityIndex = paths.indexOf("opportunities");
    const opportunityIdIndex = opportunityIndex + 1;

    // If we have an opportunity title, we add it do the id
    if (opportunityTitle && breadcrumbs[opportunityIdIndex]){ 
      breadcrumbs[opportunityIndex]!.displayName += `: ${opportunityTitle}`;
      breadcrumbs.splice(opportunityIdIndex, 1);
    }
    else {
      breadcrumbs.splice(opportunityIdIndex, 1)
    }
  }

  function findFullPath(path: string) {
    return "/" + originalPaths.slice(0, originalPaths.findIndex((p) => p === path)+ 1).join("/");
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem> <BreadcrumbLink href="/">Home</BreadcrumbLink> </BreadcrumbItem>
        {breadcrumbs.map(({displayName, path}, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator/>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href={
                    findFullPath(path)
                  }>
                    {displayName}
                  </BreadcrumbLink>
              </BreadcrumbItem>
          </React.Fragment>
        ))}
        <BreadcrumbSeparator/>     
        <BreadcrumbPage>{title}</BreadcrumbPage>
      </BreadcrumbList>
  </Breadcrumb>
  );
}
