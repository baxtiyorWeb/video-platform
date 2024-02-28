import { Spin } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebaseConfig';

export default function Details() {
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	useEffect(() => {
		const getAllData = async () => {
			setLoading(true);
			const docRef = doc(db, 'videos', id);
			const targetDoc = await getDoc(docRef);
			setLoading(false);
			return { user: setData(targetDoc.data()) };
		};
		getAllData();
	}, []);
	return (
		<div className='flex justify-center items-center flex-col h-[65vh] p-1'>
			{loading ? (
				<div className='fixed z-10 w-full h-[100vh] top-0 left-0 flex justify-center items-center'>
					<Spin />
				</div>
			) : (
				<div className='w-[80%] h-full'>
					<video
						src={data?.url}
						className='w-[100%] h-full border object-contain rounded-md'
						controls
					></video>

					<div className='flex justify-start w-full items-center mt-5 mb-3'>
						<h1 className='text-2xl'>{data.title ? data.title : 'no title'}</h1>
						<h1 className='text-2xl mr-5 ml-5 text-teal-500'>{data.email}</h1>
					</div>
				</div>
			)}
		</div>
	);
}
