import { Button, Input, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebaseConfig';
export default function Register({ userId }) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [state, setState] = useState({
		email: '',
		password: '',
	});

	async function addManageData(uid, email) {
		const date = new Date();
		const dateNow = `${date.getDay()} : ${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`;
		const R = Math.floor(Math.random() * 255);
		const G = Math.floor(Math.random() * 255);
		const B = Math.floor(Math.random() * 255);

		const docRef = await addDoc(collection(db, 'videos'), {
			date: dateNow,
			descripton: '',
			id: uid,
			title: '',
			url: '',
			profileImg: '',
			photoUrl: `rgb(${R} ${G} ${B})`,
			userName: '',
			password: '',
			email: email,
		});
	}
	const registerWithEmailAndPassword = async () => {
		try {
			setLoading(true);
			createUserWithEmailAndPassword(auth, state.email, state.password)
				.then(userCredential => {
					// Signed in
					const { email, uid } = userCredential.user;

					addManageData(uid, email);
					// ...

					message.success("muvaffaqiyatli ro'xatdan o'tdingiz");
					navigate('/auth/login');
				})
				.catch(error => {
					const errorMessage = error;
					console.log(errorMessage);
					message.error('register error failed', errorMessage);
				});
		} catch (error) {
			const errorMessage = error.message;
			console.log(errorMessage);
			message.error('register error failed', errorMessage);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div>
			<h1>register</h1>
			<div>
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
					onClick={registerWithEmailAndPassword}
				>
					send
				</Button>

				<span>
					<Link
						className='mr-3 ml-5 hover:underline transition duration-100  '
						to={'/auth/login'}
					>
						oldin ro'yxatdan o'tganmisiz
					</Link>
				</span>
			</div>
		</div>
	);
}
