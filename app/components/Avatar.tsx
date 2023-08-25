import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { clsx } from "clsx";

enum Variant {
  Circle,
  Rounded,
}

type AvatarProps = {
    src: string,
    initials: string,
  variant: Variant;
  renderInvalidUrls?: boolean;
  isOnline?: boolean;
};

const Avatar = ({
    src,
    initials,
  variant,
  isOnline = false,
}: AvatarProps) => {

  return (
    <AvatarPrimitive.Root
          className="relative inline-flex h-10 w-10"
    >
        <AvatarPrimitive.Image
        src={src}
        alt="Avatar"
        className={clsx(
            "h-full w-full object-cover",
            {
            [Variant.Circle]: "rounded-full",
            [Variant.Rounded]: "rounded",
            }[variant]
        )}
        />
        {isOnline && (
        <div
            className={clsx(
            "absolute bottom-0 right-0 h-2 w-2",
            {
                [Variant.Circle]: "-translate-x-1/2 -translate-y-1/2",
                [Variant.Rounded]: "",
            }[variant]
            )}
        >
            <span className="block h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        )}
        <AvatarPrimitive.Fallback
        className={clsx(
            "flex h-full w-full items-center justify-center bg-white dark:bg-gray-800",
            {
            [Variant.Circle]: "rounded-full",
            [Variant.Rounded]: "rounded",
            }[variant]
        )}
        delayMs={600}
        >
        <span
        className={clsx(
            "flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800",
            {
            [Variant.Circle]: "rounded-full",
            [Variant.Rounded]: "rounded",
            }[variant]
        )}>
            {initials}
        </span>
        </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

Avatar.variant = Variant;
export { Avatar };
