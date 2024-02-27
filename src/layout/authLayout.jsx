import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
	return (
		<div className='w-full h-full flex justify-center items-center'>
			<Outlet />
		</div>
	);
}
