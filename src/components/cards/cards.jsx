import { Card, Col, Row, Spin } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebaseConfig';

export default function Cards() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	const playVideo = e => {};

	useEffect(() => {
		(async () => {
			setLoading(true);
			const colRef = collection(db, 'video');
			const snapshots = await getDocs(colRef);
			const docs = snapshots.docs.map(doc => {
				const data = doc.data();
				data.id = doc.id;
				return data;
			});
			setData(docs);
			setLoading(false);
		})();
	}, []);
	return (
		<div className='w-full'>
			{loading ? (
				<div className='fixed w-full h-[100vh] top-0 left-0 flex justify-center items-center'>
					<Spin />
				</div>
			) : (
				<Row gutter={16} className='w-full border'>
					{data.length === 0
						? 'no such data'
						: data.map((item, index) => (
								<Col span={8} key={item.id}>
									<Card title='Card title' bordered={true} loading={false}>
										<video
											src={`${item.url}`}
											className='w-full h-[250px] border object-fill'
											controls
										></video>
									</Card>
								</Col>
						  ))}
				</Row>
			)}
		</div>
	);
}
