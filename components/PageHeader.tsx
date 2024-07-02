import React, { ReactNode } from "react";
import Breadcrumbs from "@components/ui/breadcrumbs";

export interface PageHeaderProps {
  breadcrumbsTitle: string;
  opportunityTitle?: string;
  pageTitle: string;
  pageDescription?: string;
  buttons?: ReactNode[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbsTitle,
  opportunityTitle,
  pageTitle,
  pageDescription,
  buttons = [],
}) => {
  return (
    <section className="">
      <div className="mb-2 flex flex-col gap-3">
        <Breadcrumbs
          title={breadcrumbsTitle}
          opportunityTitle={opportunityTitle}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {pageTitle}
          </h1>
          <div className="hidden sm:flex sm:flex-wrap sm:gap-4">
            {buttons.map((Button, index) => (
              <React.Fragment key={index}>{Button}</React.Fragment>
            ))}
          </div>
        </div>
        <p className="text-muted-foreground">{pageDescription}</p>
        {buttons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 sm:hidden">
            {buttons.map((Button, index) => (
              <React.Fragment key={index}>{Button}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
