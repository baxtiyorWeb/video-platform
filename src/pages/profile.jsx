import { Button, Input, Progress, message } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
	getDownloadURL,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db, storage } from '../config/firebaseConfig';
export default function Profile() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [userAbout, setUserAbout] = useState([]);
	const [userData, setUserData] = useState([]);
	const [isLoading, setIsLoading] = useState([]);
	const [progress, setProgress] = useState();
	const [url, setUrl] = useState();
	const [state, setState] = useState({
		photoUrl: '',
	});
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				setUserAbout(user);
			} else {
				navigate('/auth/login');
			}
		});
		getUserAbout();
	}, []);
	const fileUplaod = async () => {
		const storageRef = ref(storage, `userImages/${state.photoUrl.name}`);
		const uploadTask = uploadBytesResumable(storageRef, state.photoUrl);
		try {
			if (state.photoUrl) {
				setIsLoading(true);
				uploadBytes(storageRef, state.photoUrl).then(snapshot => {
					console.log(snapshot.metadata.name);
				});
				setIsLoading(false);

				uploadTask.on(
					'state_changed',
					snapshot => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						setProgress(Math.floor(Math.ceil(progress)));
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
						}
					},
					error => {
						console.log(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
							setUrl(downloadURL);
							console.log('File available at', downloadURL);
							const userRef = doc(db, 'videos', id);
							await updateDoc(userRef, {
								photoUrl: downloadURL,
							});
							message.success('profile rasmingiz yangilandi');
						});
					}
				);
			}
		} catch (error) {
			console.log('error', error);
		} finally {
			setIsLoading(false);
		}
	};
	const getUserAbout = async () => {
		const userRef = doc(db, 'videos', id);
		const snapshot = await getDoc(userRef);
		if (snapshot.exists()) {
			setUserData(snapshot.data());
		}
	};

	async function saveImg() {}

	return (
		<div>
			<h1>profile</h1>

			{userAbout.photoURL === '' ? (
				<div
					className={` select-none w-[80px] h-[80px] rounded-full flex justify-center pb-1 items-center border bg-gradient-to-r from-cyan-500 to-blue-500 text-[40px] leading-[21px] text-white align-middle`}
				>
					<span>{userAbout.email.split('', 1)}</span>
				</div>
			) : (
				<>
					<img
						className='w-[40px] h-[40px] rounded-full mr-3'
						src={url || userData.photoUrl}
						alt=''
					/>
					{state.photoUrl && <Progress percent={progress} />}
				</>
			)}
			<Input
				type='file'
				onChange={e => setState({ ...state, photoUrl: e.target.files[0] })}
			/>
			{state.photoUrl && url != '' ? (
				<Button onClick={saveImg && fileUplaod}>rasm yuklash</Button>
			) : (
				''
			)}

			<h1>{userAbout.email}</h1>
			<h1>{userAbout.displayName}</h1>
		</div>
	);
}
