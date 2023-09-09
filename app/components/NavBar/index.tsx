import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./components/Logo";
import User from "./components/User";

function NavBar() {
  const pathname = usePathname();
  const links = [
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
          <div className="flex gap-6 py-4">
            {links.map((link) => {
              const component = (
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        "whitespace-nowrap hover:text-black dark:hover:text-white",
                        link.href === pathname
                          ? "text-black dark:text-white"
                          : "text-gray-500",
                      )}
                    >
                      {link.text}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              );

              if (link.protected) {
                return (
                  <ProtectedItem key={link["path"]} roles={link.roles}>
                    {component}
                  </ProtectedItem>
                );
              }

              return component;
            })}
          </div>
        </NavigationMenu.List>
      </Section>
    </NavigationMenu.Root>
  );
}

export default NavBar;
