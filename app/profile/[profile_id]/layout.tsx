export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="p-8">{children}</section>;
}
