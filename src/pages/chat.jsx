import { Button, Input } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { uid } from 'uid';
import { auth, db } from '../config/firebaseConfig';

export default function Chat({ uiid }) {
	const { id } = useParams();
	const [user, setUser] = useState([]);
	const [users, setUsers] = useState([]);
	const [data, setData] = useState([]);
	const [idsD, setIdsD] = useState();
	const [messages, setMessages] = useState('');
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		chats();
		const q = query(collection);
		setLoading(false);
	}, [user]);

	const chats = async () => {
		const dbRef = collection(db, 'chat');
		onAuthStateChanged(auth, async user => {
			if (user) {
				const { email, uid } = user;
				setIdsD(user);
				const docSnap = await getDocs(dbRef);
				const datas = docSnap.docs.map(item => item.data());
				setUsers(datas);
				const userIDs = datas.filter(item => item.email === email);
				const ids = userIDs.map(item => item.id);
				const q = query(
					collection(db, 'chat'),
					where('id', '==', ids.toString())
				);

				const querySnapshot = await getDocs(q);
				querySnapshot.forEach(async item => {
					const userRef = doc(db, 'chat', item.id);
					const id = item.id;
					console.log(userRef.id);
					const datas = data.filter(item => item.id === id);
				});
			}
		});
	};
	const getUsers = async () => {
		const dbRef = collection(db, 'videos');
		onAuthStateChanged(auth, async user => {
			if (user) {
				const { email } = user;
				setIdsD(user);

				const docSnap = await getDocs(dbRef);
				const datas = docSnap.docs.map(item => item.data());
				const userIDs = datas.filter(item => item.email === email);
				const ids = userIDs.map(item => item.id);

				const q = query(
					collection(db, 'videos'),
					where('id', '==', ids.toString())
				);

				const querySnapshot = await getDocs(q);
				const usersChatRef = collection(db, 'chat');
				querySnapshot.forEach(async item => {
					const id = uid();
					const date = new Date().getTime();
					console.log(item.email);
					const time = await addDoc(usersChatRef, {
						msg: messages,
						createdAt: serverTimestamp(),
						email: email,
						id: id,
					});

					const datas = data.filter(item => item.id === id);
					setUser(datas);
				});
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
							: users.map(item => (
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
												<span className='text-blue-800'>{item.email}</span>
												<span key={item.id}>{item.msg}</span>
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
					onChange={e => setMessages(e.target.value)}
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
