import { Card, Col, Empty, Row, Spin } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
export default function Cards() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		(async () => {
			setLoading(true);
			const colRef = collection(db, 'videos');
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
		<div className='w-full '>
			{loading ? (
				<div className='fixed w-full h-[100vh] top-0 left-0 flex justify-center items-center'>
					<Spin />
				</div>
			) : (
				<Row gutter={16} className='w-full overflow-scroll'>
					{data.length === 0 ? (
						<div className='w-full h-[85vh] flex justify-center items-center  '>
							<Empty />
						</div>
					) : (
						data.map((item, index) => (
							<Col span={8} key={item.id} className='overflow-scroll'>
								<Card
									title={item.title ? item.title : 'no title'}
									bordered={true}
									loading={loading ? true : false}
									className='m-10 '
								>
									<video
										src={`${item.url}`}
										className='w-full h-[250px] border object-fill cursor-pointer'
										onClick={() => navigate(`/watch/${item.id}`)}
									></video>

									<div>
										<span className='text text-[15px] text-teal-500 text-justify'>
											email: {item.email}
										</span>
										<p className='text text-xl text-justify'>
											{item.description}
										</p>
									</div>
								</Card>
							</Col>
						))
					)}
				</Row>
			)}
		</div>
	);
}
