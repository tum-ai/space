import { getServerAuthSession } from "server/auth";
import { LoginForm } from "./_components/loginForm";
import { redirect } from "next/navigation";

const Auth = async () => {
  const session = await getServerAuthSession();
  if (session?.user?.id) redirect("/");

  return (
    <section className="flex h-screen items-center justify-center">
      <LoginForm />
    </section>
  );
};

export default Auth;
