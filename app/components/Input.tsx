import { VariantProps, cva } from "class-variance-authority";

interface Props
  extends VariantProps<typeof styles>,
    React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const styles = cva(
  "flex min-h-[2.75rem] rounded-lg border-2 px-2 outline-none",
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
const labelStyles = cva("text-sm", {
  variants: {
    state: {
      default: "",
      error: "text-red-500",
    },
  },
});

function Input({ label, state, fullWidth, className, ...props }: Props) {
  const InnerInput = (
    <input {...props} className={styles({ state, fullWidth, className })} />
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
