import { UserOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { uid } from 'uid';
import { auth, db } from '../config/firebaseConfig';

export default function Chat({ uiid }) {
	const [users, setUsers] = useState([]);
	const [data, setData] = useState([]);
	const [idsD, setIdsD] = useState();
	const [value, setValue] = useState([]);
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		onAuthStateChanged(auth, async user => {
			if (user) {
				setIdsD(user);

				const q = query(collection(db, 'chat'), orderBy('timestamp'));
				const unsubcribe = onSnapshot(q, querySnapshot => {
					let message = [];

					querySnapshot.forEach(doc => {
						message.push({ ...doc.data(), id: doc.id });
					});
					setMessages(message);
					setUsers(message);
				});
				setLoading(false);
				return () => unsubcribe();
			}
		});
	}, []);

	const getUsers = async () => {
		const dbRef = collection(db, 'videos');
		onAuthStateChanged(auth, async user => {
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
				});
				message.success('sending messages');
			} else {
				navigate('/auth/login');
			}
		});
	};

	return (
		<div className='flex justify-between items-center flex-col h-[80vh]'>
			<div className='w-full overflow-scroll'>
				<div className='flex flex-col w-full border-b-2 border-slate-600'>
					<div className='flex flex-col w-auto  border p-5 '>
						{loading
							? 'loading...'
							: users?.map(item => (
									<div
										key={item.id}
										className={`${
											item?.email === idsD?.email
												? 'text-teal-500  border flex justify-end items-end flex-col w-full mt-3 mb-3'
												: 'text-red-500 flex justify-start items-start flex-col w-full mt-3 mb-3'
										}`}
									>
										<div
											className='flex justify-center items-center'
											key={item.id}
										>
											<div className='mr-3 border flex flex-col'>
												<div className='text-blue-800 flex justify-center items-center border-b-2 p-3 '>
													{idsD.photoURL === null ? (
														<UserOutlined className='w-[40px] h-[40px] rounded-full border flex justify-center items-center mr-1 ml-1 text-[20px]' />
													) : (
														<img
															className='w-[40px] h-[40px] rounded-full'
															src={idsD.photoURL}
															alt=''
														/>
													)}

													<div>{item.email}</div>
												</div>
												<span key={item.id} className='mt-3 mb-3'>
													{item.msg}
												</span>
											</div>
										</div>
									</div>
							  ))}
					</div>
				</div>
			</div>
			<div className='flex justify-center items-center w-full'>
				<Input
					type='text'
					className='p-3 text-[18px]'
					placeholder='enter your messages'
					onChange={e => setValue(e.target.value)}
				/>
				<Button onClick={getUsers} title='submit' className='h-full'>
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
