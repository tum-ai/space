import { Button } from "./ui/button";

/**
 * @deprecated. use shadcn icon button
 * https://ui.shadcn.com/docs/components/button#icon
 */
export const ButtonIcon = ({
  icon,
  ...buttonProps
}: {
  icon: React.ReactNode;
} & React.ComponentProps<typeof Button>) => {
  return (
    <Button variant="ghost" size="icon" {...buttonProps}>
      {icon}
    </Button>
  );
};
