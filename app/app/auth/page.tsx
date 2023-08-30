"use client";
import Input from "@components/Input";
import { Section } from "@components/Section";
import { auth } from "@config/firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStores } from "../../providers/StoreProvider";

const Auth = observer(() => {
  const { meModel } = useStores();
  const credentials = meModel.credentials;
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    )
      .then(() => {
        toast.success("logged in");
        router.push("/");
      })
      .catch((err: FirebaseError) => {
        toast.error(err.message);
      });
  };

  return (
    <Section>
      <form
        onSubmit={handleLogin}
        className="m-auto flex max-w-[500px] flex-col gap-4"
      >
        <Input
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="example@tum-ai.com"
          onChange={(e) =>
            meModel.setCredentials({
              ...credentials,
              email: e.target.value,
            })
          }
          required={true}
        />
        <Input
          label="Password"
          type="password"
          id="password"
          name="password"
          onChange={(e) =>
            meModel.setCredentials({
              ...credentials,
              password: e.target.value,
            })
          }
          required={true}
        />
        <hr className="col-span-2" />
        <button
          type="submit"
          className="rounded-lg bg-gray-200 p-4 px-8 py-1 text-black"
        >
          <div>Log in</div>
        </button>
      </form>
    </Section>
  );
});

export default Auth;
