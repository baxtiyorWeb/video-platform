import { Button, Input, message } from 'antd';
import {
	GoogleAuthProvider,
	getRedirectResult,
	signInWithEmailAndPassword,
	signInWithRedirect,
} from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
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

	useEffect(() => {
		setLoading(true);
		getRedirectResult(auth)
			.then(response => {
				if (!response) return;

				// Your code here
				console.log(response);
				const { displayName, email, photoURL } = response.user;
				const uiid = uid();
				addDoc(collection(db, 'videos'), {
					date: serverTimestamp(),
					description: '',
					id: uiid,
					title: '',
					url: '',
					profileImg: '',
					photoUrl: photoURL,
					userName: displayName,
					password: '',
					email: email,
				});
				message.success('login successfully');
				navigate('/profile');
			})
			.catch(error => {
				console.error(error);
			})
			.finally(() => setLoading(false));
	}, []);

	const provider = new GoogleAuthProvider();
	const loginWithGoogle = () => {
		signInWithRedirect(auth, provider)
			.then(result => {
				// This gives you a Google Access Token. You can use it to access the Google API.
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
