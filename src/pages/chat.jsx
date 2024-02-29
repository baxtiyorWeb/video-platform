import { Button, Empty, Input, Spin, message } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import {
	addDoc,
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import {
	getDownloadURL,
	uploadBytes,
	uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uid } from 'uid';
import { auth, db, storage } from '../config/firebaseConfig';

export default function Chat({ uiid }) {
	const [users, setUsers] = useState([]);
	const { id } = useParams();
	const [progress, setProgress] = useState('');
	const [fileUrl, setFileUrl] = useState('');
	const [idsD, setIdsD] = useState();
	const [onlineUserID, setOnlineUserID] = useState('');
	const [value, setValue] = useState([]);
	const [file, setFile] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	useEffect(() => {
		fetchMessages();
		scrollToBottom();
		closeWindow();
	}, []);

	async function fileUplaod() {
		const storageRef = ref(storage, `chat-files/${file.name}`);
		const updloadTask = uploadBytesResumable(storageRef, file);

		try {
			if (file) {
				setLoading(true);
				uploadBytes(storageRef, file).then(snaphshot => {
					console.log(snaphshot.metadata.name);
				});

				updloadTask.on(
					'state_changed',
					snaphshot => {
						const progress =
							(snaphshot.bytesTransferred / snaphshot.totalBytes) * 100;
						setProgress(Math.floor(Math.ceil(progress)));

						switch (snaphshot.state) {
							case 'paused':
								console.log('upload paused');
								break;
							case 'running':
								console.log('upload is running');
								break;
						}
					},
					error => {
						console.log(error);
					}
				),
					() => {
						getDownloadURL(updloadTask.snapshot.ref).then(async downloadUrl => {
							setFileUrl(downloadUrl);
							const chatRef = doc(db, 'chat', id);
							await update(chatRef, {
								file: downloadUrl,
							});
							message.success('fayl yuklandi ');
						});
					};
			}
		} catch (error) {
			console.log('error', error);
		} finally {
			setLoading(false);
		}
	}

	async function closeWindow(userId) {
		const beforeUnloadHandler = event => {
			const message = "O'yinni tark etmoqchimisiz?";
			event.returnValue = message; // Standard
			return message; // Firefox
		};
		window.addEventListener('beforeunload', beforeUnloadHandler);

		const userDocRef = doc(db, 'chat', userId);
		await updateDoc(userDocRef, {
			status: false,
		});

		return () => {
			window.removeEventListener('beforeunload', beforeUnloadHandler);
		};
	}

	function fetchMessages() {
		const updateOnlineStatus = async (userId, status) => {
			const userDocRef = doc(db, 'chat', userId);
			await updateDoc(userDocRef, {
				status: true,
			});
			closeWindow(userId);
		};

		// Auth durum değişikliklerini izle
		onAuthStateChanged(auth, async user => {
			setLoading(true);

			if (user) {
				setIdsD(user);

				// Kullanıcı giriş yaptığında "online" olarak işaretle

				const q = query(collection(db, 'chat'), orderBy('timestamp'));
				const unsubscribe = onSnapshot(q, querySnapshot => {
					let messages = [];

					querySnapshot.forEach(async doc => {
						messages.push({ ...doc.data(), id: doc.id });
						setOnlineUserID(doc.id, 'online');
					});

					setUsers(messages);
					setLoading(false);
				});

				return () => {
					// Kullanıcı çıkış yaptığında "offline" olarak işaretle
					updateOnlineStatus(onlineUserID, 'offline');
					readingMessage();
					unsubscribe();
				};
			} else {
				navigate('/auth/login');
			}
		});
	}
	const messageDivRef = useRef(null);

	// Function to scroll to the bottom
	const scrollToBottom = () => {
		if (messageDivRef.current) {
			messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
		}
	};

	const postData = async e => {
		if (value != '') {
			onAuthStateChanged(auth, async user => {
				if (message !== '') {
					if (user) {
						const { email, photoURL, displayName } = user;
						setIdsD(user);

						const id = uid();
						const timestamp = serverTimestamp();
						const usersChatRef = collection(db, 'chat');
						const time = await addDoc(usersChatRef, {
							msg: value,
							email: email,
							name: displayName,
							id: id,
							timestamp: timestamp,
							photo: photoURL,
							status: true,
							file: file,
						});
						scrollToBottom();
						message.success('sending messages');
					} else {
						navigate('/auth/login');
					}
				}
			});
		}
	};

	return (
		<div className='flex justify-between items-center flex-col h-[80vh]'>
			<div
				className='w-full overflow-scroll h-[100vh] p-10 block-response  relative'
				ref={messageDivRef}
			>
				{/* <div className='w-[50px] h-[50px] rounded-full border fixed right-[60px] bottom-[180px] z-10 cursor-pointer'></div> */}
				<div className='flex flex-col w-full  items-center pl-10'>
					<div className='flex flex-col w-auto h-full p-5'>
						{loading ? (
							<Spin />
						) : users.length === 0 ? (
							<Empty description={'chat mavjud emas'} />
						) : (
							users?.map(item => (
								<>
									<div
										key={item.id}
										className={`${
											item?.email === idsD?.email
												? 'text-teal-500 rounded-r-xl mb-3 font-serif text-[20px]  bg-[#F0F0F0] flex justify-end relative items-end flex-col w-full mt-3 p-10 response-scroll response-scroll-user'
												: ' bg-[#E2FFE9] rounded-l-2xl flex justify-start items-start text-[20px] relative flex-col w-full mt-3 mb-3 p-10 response-scroll'
										}`}
									>
										<div
											className='flex justify-center items-center'
											key={item.id}
										>
											<div className='mr-3  flex flex-col'>
												<div className='text-blue-800 flex justify-start items-center p-3 '>
													<div
														className={
															item.status
																? 'w-[15px] absolute right-0 bottom-0 h-[15px] rounded-[100%] bg-green-500'
																: 'w-[15px] h-[15px] absolute right-0 bottom-0 rounded-[100%] bg-red-500'
														}
													></div>
													{item?.email !== idsD?.email ? (
														item.photo === null ? (
															<div
																className={`select-none w-[40px] h-[40px] rounded-full flex justify-center pb-1 items-center border bg-gradient-to-r from-cyan-500 to-blue-500 text-[25px] leading-[21px] text-white align-middle `}
															>
																<span>{item.email.split('', 1)}</span>
															</div>
														) : (
															<img
																className='w-[40px] h-[40px] rounded-full mr-3 '
																src={
																	item.photo ||
																	'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'
																}
																alt=''
															/>
														)
													) : (
														''
													)}
												</div>

												<div className='pl-10 user-chat-response'>
													<span key={item.id} className='mt-3 mb-3'>
														{item.msg}
													</span>
												</div>
											</div>
										</div>

										<div className='text-center text-[18px] absolute right-5 top-5'>
											{item?.timestamp?.toDate().toUTCString().slice(17, 22)}
										</div>
									</div>
									<div className='text-center text-[18px] w-full text-green-500'>
										<hr />
										{item?.timestamp?.toDate().toUTCString().slice('', 26)}
										<hr />
									</div>
								</>
							))
						)}
					</div>
				</div>
				<div className='flex justify-center items-center w-full chat-details-response'>
					<input
						type='text'
						className='p-3 text-[18px]'
						placeholder='enter your messages'
						onChange={e => setValue(e.target.value)}
						onKeyDown={e => (e.key === 'Enter' ? postData() : '')}
					/>
					<Input
						type='file'
						className='w-[180px] input-file-style'
						onChange={e => setFile(e.target.files[0])}
					/>
					<Button onClick={postData} title='submit' className='h-[50px]'>
						submit
					</Button>
				</div>
			</div>
		</div>
	);
}
// if (user) {
//   const { displayName, email } = user;
//   const uiid = uid();

//   get(child(realtimeDb, `user/${uiid}`))
//     .then(snapshot => {
//       if (snapshot.exists()) {
//         console.log(snapshot.val());
//       } else {
//         console.log('No data available');
//       }
//     })
//     .catch(error => {
//       console.error(error);
//     });
// } else {
//   message.warning("iltimos ro'yxatdan o'ting yoki dasturga kiring");
// }
