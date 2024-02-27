import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Upload from './components/upload';
import { db } from './config/firebaseConfig';
import LayoutComponent from './layout/Layout';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Chat from './pages/chat';
import Details from './pages/details';
import Home from './pages/home';
import Profile from './pages/profile';

function App() {
	const [loading, setLoading] = useState();
	const [userId, setUserId] = useState([]);
	const [data, setData] = useState([]);
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

		const userIdTest = data.map(item => item.id);
		console.log(userId);
		setUserId(userIdTest);
	}, []);
	return (
		<Routes>
			<Route path='/' element={<LayoutComponent userId={userId} />}>
				<Route path='/' element={<Home data={data} loading={loading} />} />
				<Route path='/upload/:id' element={<Upload />} />
				<Route path='/watch/:id' element={<Details />} />
				<Route path='/auth'>
					<Route path='/auth/login' element={<Login userId={userId} />} />
					<Route path='/auth/register' element={<Register userId={userId} />} />
				</Route>
				<Route path='/profile/' element={<Profile userId={userId} />} />
				<Route path='/chat/:id' element={<Chat userId={userId} />} />
			</Route>
		</Routes>
	);
}

export default App;
