import React from "react";
import PageHeader, { PageHeaderProps } from "@components/PageHeader";

interface PageTemplateProps extends PageHeaderProps {
  children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  ...headerProps
}) => {
  return (
    <section className="space-y-8 p-8">
      <PageHeader {...headerProps} />
      <div>{children}</div>
    </section>
  );
};

export default PageTemplate;
