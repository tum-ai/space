import { getServerAuthSession } from "server/auth";
import { LoginForm } from "./_components/loginForm";
import { redirect } from "next/navigation";

const Auth = async () => {
  const session = await getServerAuthSession();
  if (session?.user?.id) redirect("/");

  return (
    <section className="flex justify-center pt-32">
      <LoginForm />
    </section>
  );
};

export default Auth;
