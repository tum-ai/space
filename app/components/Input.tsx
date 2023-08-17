function Input({ label, ...props }) {
  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-thin">{label}</label>}
      <input
        {...props}
        className="rounded border bg-gray-100 p-2 outline-none dark:bg-gray-700"
      />
    </div>
  );
}

export default Input;
