import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex items-center justify-center">
        <h1 className="flex align-center"> Welcome to TUM.ai Space, {session?.user.first_name}</h1>
    </div>
  );
};

export default ProfilePage;