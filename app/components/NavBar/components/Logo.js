import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href={"/"}>
      <Image
        className="hidden dark:block"
        priority
        src="/logo/Group 6281-2.svg"
        height={48}
        width={48}
        alt="logo"
      />
      <Image
        className="visible dark:hidden"
        priority
        src="/logo/Group 6281-1.svg"
        height={48}
        width={48}
        alt="logo"
      />
    </Link>
  );
}

export default Logo;
