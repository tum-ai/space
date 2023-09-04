function Input({ label, ...props }) {
  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-thin">{label}</label>}
      <input
        {...props}
        className="h-[2.75rem] rounded-lg border bg-white px-2 outline-none dark:border-gray-500 dark:bg-gray-700 "
      />
    </div>
  );
}

export default Input;
