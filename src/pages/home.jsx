import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cards from '../components/cards/cards';
import { auth } from '../config/firebaseConfig';

export default function Home() {
	const navigate = useNavigate();
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const {} = user;
			} else {
				navigate('/auth/login');
			}
		});
	}, []);
	return (
		<div>
			<Cards />
		</div>
	);
}
