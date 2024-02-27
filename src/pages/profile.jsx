import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
export default function Profile() {
	const navigate = useNavigate();
	const [userAbout, setUserAbout] = useState([]);
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				setUserAbout(user);
			} else {
				navigate('/auth/login');
			}
		});
	}, []);

	return (
		<div>
			<h1>profile</h1>
			<img
				className='w-[50px] h-[50px] rounded-full'
				src={userAbout.photoURL}
				alt=''
			/>
			<h1>{userAbout.email}</h1>
			<h1>{userAbout.displayName}</h1>
		</div>
	);
}
