"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const SignOut = () => {
  const router = useRouter();

  signOut({ redirect: false });

  useEffect(() => {
    const newPath = `/auth`;
    router.push(newPath);
  }, [router]);

  return null; // maybe add a loading spinner here
};

export default SignOut;
