"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useStores } from "../providers/StoreProvider";
import Input from '/components/Input';

function Auth() {
  const { meModel } = useStores();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(e);
    console.log(data);
    try {
      await meModel.login(data.email, data.password);
      router.push("/");
    } catch (err) {
      setError(true);
      // TODO case handling and proper output
      setErrorMessage("Login went wrong");
      console.log(err);
    }
  };

  return (
		<div className='flex flex-col space-y-2 rounded-lg p-20 bg-white dark:bg-gray-700 col-span-2 flex space-x-2'>
			<form
				onSubmit={handleLogin}
				className='flex flex-col gap-4 lg:gap-8 w-1/3 mx-auto'
			>
				<Input
					label='Email'
					type='email'
					id='email'
					name='email'
					placeholder='example@tum-ai.com'
					onChange={(e) =>
            setData({
              ...data,
              email: e.target.value,
            })}
					required={true}
				/>
				<Input
					label='Password'
					type='password'
					id='password'
					name='password'
					onChange={(e) =>
            setData({
              ...data,
              password: e.target.value,
            })}
					required={true}
				/>
				<hr className='col-span-2' />
					<button
						type='submit'
						className='p-4 px-8 py-1 rounded-lg bg-gray-200 text-black'
					>
						<div>Log in</div>
					</button>
			</form>
		</div>
	);
}

export default Auth;
