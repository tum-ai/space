import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="pt-[50%] text-center sm:pt-40">
        <h1 className="font-bold glow text-4xl">All&apos;s Well That Ends Well, <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 animate-slide fast-slide">{session?.user.first_name ?? "Oh, there's nobody here :(" }</span></h1>
        <h2 className="font-thin p-8"> Welcome to TUM.ai </h2>
    </div>
  );
};

export default ProfilePage;