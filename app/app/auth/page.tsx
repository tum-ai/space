"use client";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import { auth } from "@config/firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useStores } from "../../providers/StoreProvider";

const Auth = observer(() => {
  const { meModel } = useStores();
  const credentials = meModel.credentials;
  const router = useRouter();
  const [openResetPassword, setOpenResetPassword] = useState(false);

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

  useEffect(() => {
    if (meModel.user) {
      router.push("/");
    }
  }, [meModel.user]);

  return (
    <>
      {!openResetPassword && (
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
            <Button type="submit">Log in</Button>
            <button
              type="button"
              onClick={() => {
                setOpenResetPassword(true);
              }}
            >
              Forgot password?
            </button>
          </form>
        </Section>
      )}
      {openResetPassword && (
        <Section>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              meModel.sendPasswordResetLink();
            }}
            className="m-auto flex max-w-[500px] flex-col gap-4"
          >
            <h2 className="text-3xl">Reset password</h2>
            <Input
              label="Email"
              type="email"
              id="resetEmail"
              name="resetEmail"
              placeholder="example@tum-ai.com"
              onChange={(e) => meModel.setResetEmail(e.target.value)}
              required={true}
            />
            <Button type="submit">Send link</Button>
            <button
              type="button"
              onClick={() => {
                setOpenResetPassword(false);
              }}
            >
              Back to login
            </button>
          </form>
        </Section>
      )}
    </>
  );
});

export default Auth;
