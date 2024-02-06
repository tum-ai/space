import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="pt-[50%] text-center sm:pt-40">
      <h1 className="glow text-4xl font-bold">
        All&apos;s Well That Ends Well,{" "}
        <span className="animate-slide fast-slide bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-4xl font-bold text-transparent">
          {session?.user?.firstName ?? "Oh, there's nobody here :("}
        </span>
      </h1>
      <h2 className="p-8 font-thin"> Welcome to TUM.ai </h2>
    </div>
  );
};

export default ProfilePage;
