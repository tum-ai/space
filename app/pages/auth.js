'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Banner from '../components/Banner';
import { useAuth } from '../providers/AuthContextProvider';

function Auth() {
	const { login, signup } = useAuth();
	const [data, setData] = useState({
		email: '',
		password: '',
	});
	const router = useRouter();
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault();
		console.log(e);
		console.log(data);
		try {
			await login(data.email, data.password);
			router.push('/');
		} catch (err) {
			setError(true);
			// TODO case handling and proper output
			setErrorMessage('Login went wrong');
			console.log(err);
		}
	};
	const handleSignup = async (e) => {
		e.preventDefault();
		console.log(e);
		console.log(data);
		try {
			await signup(data.email, data.password);
			router.push('/');
		} catch (err) {
			setError(true);
			// TODO case handling and proper output
			setErrorMessage('Signup went wrong');
			console.log(err);
		}
	};
	// TODO extract common component OR directly display necessary singup fields in the signup part
	return (
		<div>
			{error ? (
				<Banner headline={'error'} text={errorMessage}></Banner>
			) : (
				<></>
			)}
			<div className='columns-2'>
				<div className='form-wrapper'>
					<h1 className='mt-60 mb-30'>Login</h1>
					<form onSubmit={handleLogin} className='form'>
						<label htmlFor='email'>
							<p>Email</p>
							<input
								onChange={(e) =>
									setData({
										...data,
										email: e.target.value,
									})
								}
								required
								type='email'
								name='email'
								id='email'
								placeholder='example@mail.com'
							/>
						</label>
						<label htmlFor='password'>
							<p>Password</p>
							<input
								onChange={(e) =>
									setData({
										...data,
										password: e.target.value,
									})
								}
								required
								type='password'
								name='password'
								id='password'
								placeholder='password'
							/>
						</label>
						<button type='submit'>Log in</button>
					</form>
				</div>

				<div className='form-wrapper'>
					<h1 className='mt-60 mb-30'>Sign up</h1>
					<form onSubmit={handleSignup} className='form'>
						<label htmlFor='email'>
							<p>Email</p>
							<input
								onChange={(e) =>
									setData({
										...data,
										email: e.target.value,
									})
								}
								required
								type='email'
								name='email'
								id='email'
								placeholder='example@mail.com'
							/>
						</label>
						<label htmlFor='password'>
							<p>Password</p>
							<input
								onChange={(e) =>
									setData({
										...data,
										password: e.target.value,
									})
								}
								required
								type='password'
								name='password'
								id='password'
								placeholder='password'
							/>
						</label>
						<button type='submit'>Sign up</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Auth;
