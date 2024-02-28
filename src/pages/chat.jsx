import { Button, Empty, Input, Spin, message } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
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
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uid } from 'uid';
import { auth, db } from '../config/firebaseConfig';

export default function Chat({ uiid }) {
	const [users, setUsers] = useState([]);
	const [idsD, setIdsD] = useState();
	const [onlineUserID, setOnlineUserID] = useState('');
	const [value, setValue] = useState([]);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	useEffect(() => {
		fetchMessages();
		scrollToBottom();
		closeWindow();
	}, []);

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
			<div className='w-full overflow-scroll relative' ref={messageDivRef}>
				<div className='w-[50px] h-[50px] rounded-full border fixed right-[60px] bottom-[180px] z-10 cursor-pointer'></div>
				<div className='flex flex-col w-full  h-[70vh] '>
					<div className='flex flex-col w-auto h-full  p-5  '>
						{loading ? (
							<Spin />
						) : users.length === 0 ? (
							<Empty description={'chat mavjud emas'} />
						) : (
							users?.map(item => (
								<div
									key={item.id}
									className={`${
										item?.email === idsD?.email
											? 'text-teal-500  border flex justify-end relative items-end flex-col w-full mt-3 mb-3'
											: 'text-red-500 flex justify-start items-start relative flex-col w-full mt-3 mb-3 border'
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

												{item.photo === null ? (
													<div
														className={`select-none w-[40px] h-[40px] rounded-full flex justify-center pb-1 items-center border bg-gradient-to-r from-cyan-500 to-blue-500 text-[25px] leading-[21px] text-white align-middle`}
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
												)}
											</div>
											<span key={item.id} className='mt-3 mb-3'>
												{item.msg}
											</span>
										</div>
									</div>
									<div className='text-center w-full'>
										{item?.timestamp?.toDate().toUTCString().split('', 26)}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
			<div className='flex justify-center items-center w-full'>
				<Input
					type='text'
					className='p-3 text-[18px]'
					placeholder='enter your messages'
					onChange={e => setValue(e.target.value)}
					onKeyDown={e => (e.key === 'Enter' ? postData() : '')}
				/>
				<Button onClick={postData} title='submit' className='h-full'>
					submit
				</Button>
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
