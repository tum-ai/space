import * as React from "react";

import { VariantProps, cva } from "class-variance-authority";

export interface SectionProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof sectionVariants> {}

const sectionVariants = cva("p-8 lg:p-12 py-6 lg:py-6", {
  variants: {
    variant: {
      default: "",
      noPadding: "p-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Section = React.forwardRef<HTMLInputElement, SectionProps>(
  ({ children, variant, className }, ref) => {
    return (
      <section className={sectionVariants({ variant, className })}>
        {children}
      </section>
    );
  },
);
Section.displayName = "Section";

export { Section };
