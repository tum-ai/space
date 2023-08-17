interface Props {
  className?: string;
  children?: React.ReactNode;
}

function Page({ className, children }: Props) {
  return <div className="p-4 pt-16 lg:p-12 lg:pt-16">{children}</div>;
}

export default Page;
