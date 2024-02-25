import { authOptions } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

async function Header() {
  const session = await getServerSession(authOptions);

  return <header>{session.user.firstName}</header>;
}

export default Header;
