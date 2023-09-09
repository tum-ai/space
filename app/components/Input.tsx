import { VariantProps, cva } from "class-variance-authority";

interface Props extends VariantProps<typeof styles> {
  label?: string;
}

const styles = cva(
  "flex min-h-[2.75rem] rounded-lg border-2 px-2 outline-none",
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

function Input({ label, state, ...props }: Props) {
  if (!label) {
    return <input {...props} className={styles({ state })} />;
  }
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-thin">{label}</label>
      <input {...props} className={styles({ state })} />
    </div>
  );
}

export default Input;
