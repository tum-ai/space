import Link from "next/link";
import { useRouter } from "next/router";
import ProtectedItem from "../../ProtectedItem";
import { useStores } from "/providers/StoreProvider";

function Links() {
  const router = useRouter();
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
      path: "/create-certificate",
      text: "Certificate",
      protected: true,
      roles: ["create_certificate"],
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
              "text-gray-500 hover:text-black dark:hover:text-white hover:underline " +
              (router.asPath?.includes(link.path) && "font-bold")
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
        } else {
          return component;
        }
      })}
    </>
  );
}

export default Links;
