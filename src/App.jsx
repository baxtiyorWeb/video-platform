import { Route, Routes } from 'react-router-dom';
import './App.css';
import Upload from './components/upload';
import LayoutComponent from './layout/Layout';
import Details from './pages/details';
import Home from './pages/home';

function App() {
	return (
		<Routes>
			<Route path='/' element={<LayoutComponent />}>
				<Route path='/' element={<Home />} />
				<Route path='/upload' element={<Upload />} />
				<Route path='/watch/:id' element={<Details />} />
			</Route>
		</Routes>
	);
}

export default App;
