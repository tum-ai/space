import ProtectedItem from "@/components/ProtectedItem";
import { Section } from "@/components/Section";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./components/Logo";
import User from "./components/User";
import { Button } from "@/components/Button";

function NavBar() {
  const pathname = usePathname();
  const links: {
    href: string;
    text: string;
    protected?: boolean;
    roles?: string[];
  }[] = [
    {
      href: "/profiles/",
      text: "Team",
    },
    {
      href: "/invite/",
      text: "Invite Members",
      protected: true,
      roles: ["invite_members"],
    },
    {
      href: "/certificate/",
      text: "Certificate",
      protected: true,
      roles: ["create_certificate"],
    },
    {
      href: "/review/",
      text: "Review Tool",
      protected: true,
      roles: ["submit_reviews"],
    },
    {
      href: "/referrals/",
      text: "Referrals",
      protected: true,
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
                      className={clsx(
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

              if (link.protected) {
                return (
                  <ProtectedItem key={link.href} roles={link.roles}>
                    <Component />
                  </ProtectedItem>
                );
              }

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
