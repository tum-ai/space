import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex items-center justify-center">
        <h1 className="flex align-center"> Welcome to TUM.ai Space, {session?.user.name}</h1>
    </div>
  );
};

export default ProfilePage;