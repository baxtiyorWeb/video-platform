import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
export default function Profile() {
	const navigate = useNavigate();
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const id = user.displayName;
			} else {
				navigate('/auth/login');
			}
		});
	}, []);

	return (
		<div>
			<h1>profile</h1>
		</div>
	);
}
