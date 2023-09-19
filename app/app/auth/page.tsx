"use client";
import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { PasswordReset } from "./components/PasswordReset";

const Auth = () => {
  const [isResetPassword, setResetPassword] = useState(false);

  return (
    <>
      {!isResetPassword && <LoginForm setResetPassword={setResetPassword} />}
      {isResetPassword && <PasswordReset setResetPassword={setResetPassword} />}
    </>
  );
};

export default Auth;
