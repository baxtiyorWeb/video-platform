import { Card, Col, Empty, Row, Spin } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
export default function Cards() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [ids, setIds] = useState('');
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
			const res = data.map(item => (item.url.innerHTML === '' ? true : false));
			const res1 = data.map(item => item.url.map(item => item));
			console.log(res1);
			setIds(res);

			// for (let i = 0; i < .url.length; i++) {
			// 	const element = item.url[i];
			// 	console.log(element);
			// }
			setLoading(false);
		})();
	}, []);
	return (
		<div className='w-full   '>
			{loading ? (
				<div className='w-full  flex justify-center items-center'>
					<Spin />
				</div>
			) : (
				<div className='h-full overflow-scroll '>
					<Row gutter={16} className='w-full h-[100vh] '>
						{ids === true ? (
							<div className='w-full  flex justify-center items-center  '>
								<Empty />
							</div>
						) : (
							data.map((item, index) =>
								item.url.map((items, index) => (
									<Col span={8} key={index}>
										<Card
											key={index}
											title={items.title ? items.title : 'no title'}
											bordered={true}
											loading={loading ? true : false}
											className='m-10 h-[510px]'
										>
											{items.type === 'video' && (
												<video
													src={`${items.typeUrl}`}
													className='w-full h-[250px] border object-fill cursor-pointer'
													onClick={() => navigate(`/watch/${item.id}`)}
												></video>
											)}
											{items.type === 'rasm' && (
												<img
													src={items.typeUrl}
													alt=''
													className='w-full h-[250px] border object-fill '
												/>
											)}
											<div>
												<span className='text text-[15px] text-teal-500 text-justify'>
													email: {items.email}
												</span>
												<p className='text text-xl text-justify'>
													{items.description}
												</p>
												<span>turi: {items.type}</span>
												<br />
											</div>
										</Card>
									</Col>
								))
							)
						)}
					</Row>
				</div>
			)}
		</div>
	);
}
