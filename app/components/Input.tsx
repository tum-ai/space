import { VariantProps, cva } from "class-variance-authority";

interface Props
  extends VariantProps<typeof styles>,
    React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const styles = cva(
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "bg-white dark:border-gray-500 dark:bg-gray-700",
        error: "bg-white text-red-700 border-red-900 dark:bg-gray-700",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);
export const labelStyles = cva("text-sm", {
  variants: {
    state: {
      default: "",
      error: "text-red-500",
    },
  },
});

function Input({ label, state, className, ...props }: Props) {
  const InnerInput = (
    <input {...props} className={styles({ state, className })} />
  );

  if (!label) {
    return InnerInput;
  }
  return (
    <div className="flex flex-col gap-2">
      <label className={labelStyles({ state })}>{label}</label>
      {InnerInput}
    </div>
  );
}

export default Input;
