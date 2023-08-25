"use client";
import { useStores } from "@providers/StoreProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedItem from "../../ProtectedItem";

function Links() {
  const pathname = usePathname()
  const { uiModel } = useStores();
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
  ];

  return (
    <>
      {links.map((link) => {
        const component = (
          <Link
            key={link["path"]}
            onClick={() => {
              uiModel.setNavBarActive(false);
            }}
            href={link.path}
            className={
              "hover:text-black dark:hover:text-white " +
              ((pathname.includes(link.path) &&
                (link.path == "/" ? pathname == link.path : true)) ?
                "text-black" : "text-gray-500")
            }
          >
            {link.text}
          </Link>
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
    </>
  );
}

export default Links;
