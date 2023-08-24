'use client';
import Input from '@components/Input';
import Page from '@components/Page';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useStores } from '../../providers/StoreProvider';

export default function Auth() {
	const { meModel } = useStores();
	const [data, setData] = useState({
		email: '',
		password: '',
	});
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		console.log(e);
		console.log(data);
		try {
			await meModel.login(data.email, data.password);
			router.push('/');
		} catch (err) {
			// TODO error handling and show in UI
			console.log(err);
		}
	};

	return (
		<Page>
			<form
				onSubmit={handleLogin}
				className='m-auto flex max-w-[500px] flex-col gap-4'
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
						})
					}
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
						})
					}
					required={true}
				/>
				<hr className='col-span-2' />
				<button
					type='submit'
					className='rounded-lg bg-gray-200 p-4 px-8 py-1 text-black'
				>
					<div>Log in</div>
				</button>
			</form>
		</Page>
	);
}
