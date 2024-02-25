import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const UserAvatar = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return <></>;
  }

  return (
    <div className="flex items-center space-x-4 rounded-full hover:text-black dark:bg-gray-700 dark:hover:text-white sm:bg-gray-100 sm:p-2 sm:px-4">
      <Avatar>
        <AvatarImage src={user.image ?? undefined} />
        <AvatarFallback>
          {`${user.firstName?.at(0)}${user.lastName?.at(0)}`}
        </AvatarFallback>
      </Avatar>
      <p className="hidden sm:flex">
        {user.firstName} {user.lastName}
      </p>
    </div>
  );
};
