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
			{userAbout.photoURL === null ? (
				<div
					className={` select-none w-[40px] h-[40px] rounded-full flex justify-center pb-1 items-center border bg-gradient-to-r from-cyan-500 to-blue-500 text-[25px] leading-[21px] text-white align-middle`}
				>
					<span>{userAbout.email.split('', 1)}</span>
				</div>
			) : (
				<img
					className='w-[40px] h-[40px] rounded-full mr-3'
					src={
						userAbout.photoURL ||
						'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'
					}
					alt=''
				/>
			)}
			<h1>{userAbout.email}</h1>
			<h1>{userAbout.displayName}</h1>
		</div>
	);
}
