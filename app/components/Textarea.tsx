function Textarea({ label, ...props }) {
  return (
    <div className="flex w-full flex-col space-y-2">
      {label && <label className="text-sm font-thin">{label}</label>}
      <textarea
        {...props}
        className="rounded border bg-gray-100 p-2 outline-none dark:bg-gray-700"
      />
    </div>
  );
}

export default Textarea;
