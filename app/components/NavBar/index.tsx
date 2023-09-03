import ProtectedItem from "@components/ProtectedItem";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import User from "./components/User";
import Logo from "./components/Logo";
import { Section } from "@components/Section";

function NavBar() {
  const pathname = usePathname();
  const links = [
    {
      path: "/",
      text: "Home",
    },
    {
      path: "/profiles",
      text: "Team",
    },
    {
      path: "/feedback",
      text: "Feedback",
      protected: true,
    },
    {
      path: "/invite",
      text: "Invite Members",
      protected: true,
      roles: ["invite_members"],
    },
    {
      path: "/certificate",
      text: "Certificate",
      protected: true,
      roles: ["create_certificate"],
    },
    {
      path: "/review",
      text: "Review Tool",
      protected: true,
      roles: ["submit_reviews"],
    },
    {
      path: "/referrals",
      text: "Referrals",
    },
  ];
  return (
    <NavigationMenu.Root className="relative w-full" orientation="vertical">
      <Section>
        <div className="mb-4 flex justify-between">
          <Logo />
          <User />
        </div>
        <NavigationMenu.List className="flex items-center justify-between overflow-x-auto">
          <div className="flex gap-6">
            {links.map((link) => {
              const component = (
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link
                      key={link["path"]}
                      href={link.path}
                      className={
                        "whitespace-nowrap hover:text-black dark:hover:text-white " +
                        (pathname.includes(link.path) &&
                        link.path === "/" &&
                        pathname == link.path
                          ? "text-black dark:text-white"
                          : "text-gray-500")
                      }
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
