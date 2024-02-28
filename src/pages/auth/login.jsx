import { Button, Input, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig';

export default function Login() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [state, setState] = useState({
		email: '',
		password: '',
	});
	const loginWithEmailAndPassword = () => {
		try {
			setLoading(true);
			signInWithEmailAndPassword(auth, state.email, state.password)
				.then(userCredential => {
					// Signed in
					const user = userCredential.user;
					console.log(user.uid);
					navigate('/');
					// ...
				})
				.catch(error => {
					const errorMessage = error;
					message.error('login error failed', errorMessage);
				});
		} catch (error) {
			const errorMessage = error.message;
			message.error('login error failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div>
			<h1>dasturga kiring</h1>
			<Input
				type='text'
				className='mt-3 mb-4 h-[50px]'
				placeholder='enter your email'
				onChange={e => setState({ ...state, email: e.target.value })}
				value={state.email}
			/>
			<Input
				type='password'
				className='mr-3 mb-4 h-[50px]'
				placeholder='enter your password'
				onChange={e => setState({ ...state, password: e.target.value })}
				value={state.password}
			/>

			<Button
				loading={loading ? true : false}
				onClick={loginWithEmailAndPassword}
			>
				send
			</Button>

			<span>
				<Link
					className='mr-3 ml-5 hover:underline transition duration-100  '
					to={'/auth/register'}
				>
					ro'yxatdan o'tmaganmisiz
				</Link>
			</span>
		</div>
	);
}
