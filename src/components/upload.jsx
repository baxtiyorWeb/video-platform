import { Button, Input, Progress, message } from 'antd';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
	getDownloadURL,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from 'firebase/storage';
import React, { useState } from 'react';
import { db, storage } from '../config/firebaseConfig';

export default function Upload() {
	const [file, setFile] = useState(null);
	const [url, setUrl] = useState(null);
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const saveData = async () => {
		const ids = Date.now();
		const dbRef = doc(db, 'video', ids.toString());
		try {
			if (url) {
				setIsLoading(true);

				const docSnap = await getDoc(dbRef);
				if (docSnap.exists()) {
					message.warning('bu user oldindan mavjud');
				} else {
					await setDoc(dbRef, {
						url: url,
						id: ids,
					});
					message.success("qo'shildi");
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const fileUplaod = () => {
		const storageRef = ref(storage, `videos/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);
		try {
			if (file) {
				setIsLoading(true);
				uploadBytes(storageRef, file).then(snapshot => {
					console.log(snapshot);
				});
				setIsLoading(false);

				uploadTask.on(
					'state_changed',
					snapshot => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
						// Handle unsuccessful uploads
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
							console.log('File available at', downloadURL);
							setUrl(downloadURL);
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

	return (
		<div>
			<Input type='file' onChange={e => setFile(e.target.files[0])} />

			<div className='w-full h-[60vh] flex justify-center items-center flex-col'>
				<video
					src={`${url}`}
					itemType='video/mp4'
					className='w-[50%] h-[50vh] border rounded object-cover object-left'
				></video>

				{file && (
					<Button
						onClick={fileUplaod}
						disabled={url || progress > 1 ? true : false}
						className='mt-5 mb-5 w-[130px] disabled:cursor-not-allowed disabled:border-green-500 disabled:bg-teal-100 h-[50px] flex justify-center items-center'
					>
						{file ? (
							<Progress type='circle' percent={progress} size={40} />
						) : (
							'send video'
						)}
					</Button>
				)}

				{url && (
					<Button loading={isLoading ? true : false} onClick={saveData}>
						videolar ro'yxatiga qo'shmoqchimisiz
					</Button>
				)}
			</div>
		</div>
	);
}
