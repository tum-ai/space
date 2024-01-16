import { Button } from "./ui/button";

export function ButtonIcon({
  icon,
  ...buttonProps
}: {
  icon: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon" {...buttonProps}>
      {icon}
    </Button>
  );
}
