import { VariantProps, cva } from "class-variance-authority";

interface Props extends VariantProps<typeof styles> {
  text: string;
  heading?: string;
  className?: string;
}

const styles = cva(
  "flex flex-col gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm",
  {
    variants: {
      state: {
        default: "bg-white dark:border-gray-500 dark:bg-gray-700",
        error: "bg-white text-red-700 border-red-900 dark:bg-gray-700",
      },
      fullWidth: {
        true: "w-full",
        false: "w-max",
      },
    },
    defaultVariants: {
      state: "default",
      fullWidth: false,
    },
  },
);

function Label({ text, heading, state, fullWidth, className }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {heading && <label className="text-sm">{heading}</label>}
      <div className={styles({ state, fullWidth, className })}>
        <label>{text}</label>
      </div>
    </div>
  );
}

export default Label;
