import { Button, Empty, Input, Spin, message } from 'antd';
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
	const [idsD, setIdsD] = useState();
	const [value, setValue] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		fetchMessages();
	}, []);

	function fetchMessages() {
		onAuthStateChanged(auth, async user => {
			setLoading(true);
			if (user) {
				setIdsD(user);

				const q = query(collection(db, 'chat'), orderBy('timestamp'));
				const unsubcribe = onSnapshot(q, querySnapshot => {
					let message = [];

					querySnapshot.forEach(doc => {
						message.push({ ...doc.data(), id: doc.id });
					});
					setUsers(message);
					setLoading(false);
				});

				return () => unsubcribe();
			}
		});
	}

	const postData = async () => {
		const dbRef = collection(db, 'videos');
		onAuthStateChanged(auth, async user => {
			if (user) {
				const { email, photoURL, displayName } = user;
				setIdsD(user);

				const id = uid();
				const timestamp = serverTimestamp();
				const usersChatRef = collection(db, 'chat');
				let date = new Date();
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
				<div className='flex flex-col w-full  h-[80vh] '>
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
											? 'text-teal-500  border flex justify-end items-end flex-col w-full mt-3 mb-3'
											: 'text-red-500 flex justify-start items-start flex-col w-full mt-3 mb-3 border'
									}`}
								>
									<div
										className='flex justify-center items-center'
										key={item.id}
									>
										<div className='mr-3  flex flex-col'>
											<div className='text-blue-800 flex justify-center items-center p-3 '>
												<img
													className='w-[40px] h-[40px] rounded-full mr-3'
													src={
														item.photo ||
														'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'
													}
													alt=''
												/>

												<div>{item.email}</div>
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
