export default function Tag(props: { text: string; color: string }) {
  const textColor = `text-${props.color}-700`;
  const bgColor = `bg-${props.color}-100`;
  return (
    <div
      className={`overflow truncate rounded-full px-2 py-1 text-sm ${textColor} ${bgColor}`}
    >
      {props.text}
    </div>
  );
}
