import { Section } from "@components/Section";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./components/Logo";
import User from "./components/User";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

interface Link {
  href: string;
  text: string;
}

function NavBar() {
  const pathname = usePathname();
  const links: Link[] = [
    {
      href: "/profiles/",
      text: "Profiles",
    },
  ];

  return (
    <NavigationMenu.Root className="relative w-full">
      <Section>
        <div className="flex justify-between">
          <Logo />
          <User />
        </div>
        <NavigationMenu.List className="flex items-center justify-between overflow-x-auto">
          <div className="flex pt-2">
            {links.map((link) => {
              const Component = () => (
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Button
                      asChild
                      variant="link"
                      className={cn(
                        "w-max hover:text-black dark:hover:text-white",
                        link.href === pathname
                          ? "text-black dark:text-white"
                          : "text-gray-500",
                      )}
                    >
                      <Link href={link.href}>{link.text}</Link>
                    </Button>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              );

              return (
                <span key={link.href}>
                  <Component />
                </span>
              );
            })}
          </div>
        </NavigationMenu.List>
      </Section>
    </NavigationMenu.Root>
  );
}

export default NavBar;
