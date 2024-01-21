function Textarea({
  label,
  variant,
  handler,
  ...props
}: {
  label?: string;
  variant?: "default" | "outlined";
  props: object;
  handler?: any;
}) {
  // Define styles for the different variants
  const variantStyles = {
    default: {
      textarea:
        "min-h-[100px] rounded-lg bg-white p-4 px-2 outline-none dark:border-gray-500 dark:bg-gray-700",
      label: "text-sm font-thin",
    },
    outlined: {
      textarea:
        "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      label: "text-sm",
    },
  };

  const classNames = variantStyles[variant] || variantStyles.default;

  return (
    <div className="flex w-full flex-col space-y-2">
      {label && <label className={classNames.label}>{label}</label>}
      <textarea {...props} className={classNames.textarea} />
    </div>
  );
}

export default Textarea;
