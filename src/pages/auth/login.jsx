import { Button, Input, message } from 'antd';
import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uid } from 'uid';
import { auth, db } from '../../config/firebaseConfig';

export default function Login() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [state, setState] = useState({
		email: '',
		password: '',
	});
	const provider = new GoogleAuthProvider();
	const loginWithGoogle = () => {
		signInWithPopup(auth, provider)
			.then(result => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				const date = new Date();
				const uiid = uid();
				const dateNow = `${date.getDay()} : ${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`;
				const docRef = addDoc(collection(db, 'videos'), {
					date: dateNow,
					descripton: '',
					id: uiid,
					title: '',
					url: '',
					profileImg: user.photoURL,
					userName: user.displayName,
					password: '',
					type: '',
					email: user.email,
				});
				navigate('/');
				// IdP data available using getAdditionalUserInfo(result)
				// ...
			})
			.catch(error => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	};
	const loginWithEmailAndPassword = () => {
		try {
			setLoading(true);
			signInWithEmailAndPassword(auth, state.email, state.password)
				.then(userCredential => {
					// Signed in
					const user = userCredential.user;
					console.log(user.uid);
					// ...

					message.success('login successfully');

					navigate('/profile');
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

			<Button onClick={loginWithGoogle}>google +</Button>

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
