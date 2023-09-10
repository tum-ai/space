import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { VariantProps, cva } from "class-variance-authority";
import { clsx } from "clsx";

interface Props extends VariantProps<typeof styles> {
  profilePicture: string;
  initials: string;
}

const styles = cva("h-10 w-10 overflow-hidden bg-white dark:bg-gray-800", {
  variants: {
    variant: {
      circle: "rounded-full",
      rounded: "rounded",
    },
  },
});

const Avatar = ({ profilePicture, initials, variant }: Props) => {
  return (
    <AvatarPrimitive.Root className={styles({ variant })}>
      <AvatarPrimitive.Image
        src={profilePicture}
        alt="Avatar"
        className={clsx("flex h-full w-full object-cover")}
      />
      <AvatarPrimitive.Fallback
        className={clsx("flex h-full w-full items-center justify-center")}
        delayMs={600}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

export { Avatar };
