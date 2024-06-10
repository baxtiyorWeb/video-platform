import { Button, Empty, Spin, Watermark, message } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import {
	addDoc,
	collection,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uid } from 'uid';
import { auth, db } from '../config/firebaseConfig';

export default function Chat() {
	const [users, setUsers] = useState([]);
	const { id } = useParams();
	const [idsD, setIdsD] = useState();
	const [onlineUserID, setOnlineUserID] = useState('');
	const [value, setValue] = useState([]);
	const [file, setFile] = useState('');
	const [userSnapshot, setUserSnapshot] = useState();
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	useEffect(() => {
		fetchMessages();
		// closeWindow();
	}, []);

	// async function closeWindow(userId) {
	// 	const beforeUnloadHandler = event => {
	// 		const message = "O'yinni tark etmoqchimisiz?";
	// 		event.returnValue = message; // Standard
	// 		return message; // Firefox
	// 	};
	// 	window.addEventListener('beforeunload', beforeUnloadHandler);

	// 	const userDocRef = doc(db, 'chat', userId);
	// 	await updateDoc(userDocRef, {
	// 		status: false,
	// 	});

	// 	return () => {
	// 		window.removeEventListener('beforeunload', beforeUnloadHandler);
	// 	};
	// }

	function fetchMessages() {
		const updateOnlineStatus = async (userId, status) => {
			const userDocRef = doc(db, 'chat', userId);
			await updateDoc(userDocRef, {
				status: true,
			});
			closeWindow(userId);
		};

		onAuthStateChanged(auth, async user => {
			setLoading(true);

			if (user) {
				setIdsD(user);

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
		if (messageDivRef.current)
			messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
		else alert('ok');
	};

	const postData = async e => {
		if (value != '') {
			onAuthStateChanged(auth, async user => {
				if (message !== '') {
					if (user) {
						const { email, photoURL, displayName } = user;
						setIdsD(user);

						const id = uid();
						const date = new Date();
						const dayNames = [
							'Yakshanba',
							'Dushanba',
							'Seshanba',
							'Chorshanba',
							'Payshanba',
							'Juma',
							'Shanba',
						];
						const dayIndex = date.getDay();
						const dayName = dayNames[dayIndex];
						const getHours = date.getHours();
						const getMinutes = date.getMinutes();
						const getSeconds = date.getSeconds();
						const timeFull = `${dayName} kuni
							-
						vaqt: ${getHours} - ${getMinutes} - ${getSeconds}`;
						const q = collection(db, 'videos');
						const snapshot = await getDocs(q);

						snapshot.docs.forEach(async doc => {
							const user = [{ ...doc.data(), id: doc.id }];
							user.map(item => setUserSnapshot(item.photoUrl));
						});
						const usersChatRef = collection(db, 'chat');
						const time = await addDoc(usersChatRef, {
							msg: value,
							email: email,
							name: displayName,
							id: id,
							photoUrl: '',
							timestamp: timeFull,
							photo: photoURL === null ? userSnapshot : photoURL,
							status: true,
							file: file,
						});
						message.success('sending messages');
						scrollToBottom();
					} else {
						navigate('/auth/login');
					}
				}
			});
		}
	};

	return (
		<Watermark content={'messages'}>
			<div className='flex justify-between items-center flex-col h-[80vh]'>
				<div
					className='w-[1400px] overflow-scroll h-[100vh] p-10 block-response  relative'
					ref={messageDivRef}
				>
					{/* <div className='w-[50px] h-[50px] rounded-full border fixed right-[60px] bottom-[180px] z-10 cursor-pointer'></div> */}
					<div className='flex flex-col  h-[100vh] items-center pl-10'>
						<div className='flex flex-col w-full items-end h-full p-5'>
							{loading ? (
								<Spin />
							) : users.length === 0 ? (
								<Empty description={'chat mavjud emas'} />
							) : (
								users?.map(item => (
									<div key={item.id} className='w-full'>
										<div className='relative '>
											<div
												className={`${
													item?.email === idsD?.email
														? 'text-teal-500 rounded-[25px] mb-3 font-serif text-[16px] flex justify-end  items-end flex-col w-auto  mt-3 p-3  response-scroll response-scroll-user'
														: ' bg-[#E2FFE9] text-sky-700  rounded-[25px] mb-3 font-serif text-[16px] flex justify-start  items-start flex-col p-3  mt-3  response-scroll '
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
																		key={item.id}
																		className={`select-none w-[40px] h-[40px] rounded-full flex justify-center pb-1 items-center  bg-gradient-to-r from-cyan-500 to-blue-500 text-[25px] leading-[21px] text-white align-middle `}
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

														<div
															className={
																item?.email === idsD?.email
																	? 'pl-5 user-chat-response p-3 rounded-2xl bg-slate-600 '
																	: 'pl-5 user-chat-response p-3 rounded-2xl bg-slate-100 '
															}
														>
															<span key={item.id} className='mt-3 mb-3'>
																{item.msg}
															</span>
														</div>
													</div>
												</div>

												<div className='text-center text-[15px] absolute right-[100px] top-5'>
													{item?.timestamp}
												</div>
											</div>
										</div>
										<div className='text-center text-[18px] w-full text-green-500'>
											{item?.timestamp}
										</div>
									</div>
								))
							)}
						</div>
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

					<Button onClick={postData} title='submit' className='h-[50px]'>
						submit
					</Button>
				</div>
			</div>
		</Watermark>
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
