import { Button, Input, Progress, Select, message } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import {
	getDownloadURL,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../config/firebaseConfig';

export default function Upload() {
	const [file, setFile] = useState(null);
	const [url, setUrl] = useState(null);
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const navigate = useNavigate();
	const date = new Date();
	const dateNow = `${date.getDay()} : ${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`;
	const [state, setState] = useState({
		title: '',
		description: '',
		date: dateNow,
		type: '',
	});

	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const users = user;
			} else {
				navigate('/auth/login');
			}
		});
	}, []);

	const saveData = async () => {
		const dbRef = collection(db, 'videos');
		try {
			if (url) {
				if (
					state.date != '' &&
					state.description != '' &&
					state.title != '' &&
					state.type != ''
				) {
					setIsLoading(true);

					const docSnap = await getDocs(dbRef);
					const datas = docSnap.docs.forEach(item => {
						setData(item.data());
					});

					onAuthStateChanged(auth, async user => {
						if (data.id === user.uid) {
							message.warning('bu user oldindan mavjud');
						} else {
							if (user) {
								const { email } = user;

								console.log(data.email);
								const docSnap = await getDocs(dbRef);
								const datas = docSnap.docs.map(item => item.data());
								const userIDs = datas.filter(item => item.email === email);
								const ids = userIDs.map(item => item.id);

								const q = query(
									collection(db, 'videos'),
									where('id', '==', ids.toString())
								);

								const querySnapshot = await getDocs(q);
								querySnapshot.forEach(async item => {
									const userRef = doc(db, 'videos', item.id);
									await updateDoc(userRef, {
										date: dateNow,
										description: state.description,
										title: state.title,
										type: state.type,
										url: url,
										email: email,
									});

									message.success("sizning videongiz qo'shildi");
								});
							} else {
								navigate('/auth/login');
							}
						}
					});
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
			<div className='w-full h-[100vh] flex justify-start items-center flex-col'>
				<Input
					type='file'
					className='mb-5 mt-4 w-[50%] cursor-pointer'
					onChange={e => setFile(e.target.files[0])}
				/>
				{file && (
					<>
						*
						<Select
							placeholder={'rasm yoki video tanlang'}
							options={[
								{
									value: 'video',
									label: 'video',
								},
								{
									value: 'rasm',
									label: 'rasm',
								},
							]}
							onChange={e => setState({ ...state, type: e })}
							className='w-[50%]]'
						/>
					</>
				)}
				{state.type === 'video' && (
					<video
						src={`${url}`}
						itemType='video/mp4'
						className='w-[50%] h-[25vh] border rounded object-fill object-center'
					></video>
				)}
				{state.type === 'rasm' && (
					<img
						src={`${url}`}
						className='w-[50%] h-[25vh] border rounded object-fill object-center'
					></img>
				)}
				<div className='mt-5 mb-3 w-full flex justify-center items-center flex-col'>
					*
					<Input
						type='text'
						placeholder="videoga sarlavha qo'ying"
						className='mt-1 mb-3 w-[50%] h-[50px]'
						onChange={e => setState({ ...state, title: e.target.value })}
						value={state.title}
					/>
					*
					<textarea
						type='text'
						placeholder="videoga sarlavha qo'ying"
						className='mt-1 mb-3 w-[50%] h-[150px] outline-none border focus:border focus:border-blue-500 rounded-md p-3 transition-all duration-300'
						onChange={e => setState({ ...state, description: e.target.value })}
						value={state.description}
					/>
				</div>

				{file && (
					<Button
						onClick={fileUplaod}
						disabled={url || progress > 0.1 ? true : false}
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
