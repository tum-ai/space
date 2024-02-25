import React from "react";
import { getServerAuthSession } from "server/auth";

const ProfilePage = async () => {
  const session = await getServerAuthSession();
  const user = session?.user;

  return (
    <div className="pt-[50%] text-center sm:pt-40">
      <h1 className="glow text-4xl font-bold">
        All&apos;s Well That Ends Well,{" "}
        <span className="bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent">
          {user?.name ?? "Oh, there's nobody here :("}
        </span>
      </h1>

      <h2 className="p-8 font-thin"> Welcome to TUM.ai </h2>
    </div>
  );
};

export default ProfilePage;
