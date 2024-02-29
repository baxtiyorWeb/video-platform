import {
	HomeOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	MessageOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
const { Header, Sider, Content } = Layout;

export default function LayoutComponent({ uiid }) {
	const [collapsed, setCollapsed] = useState(false);
	const [userId, setUserId] = useState(0);
	const [user, setUser] = useState();
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const navigate = useNavigate();

	if (typeof window != 'undefined' && window.document) {
		document.body.style.overflow = 'hidden';
	}
	const getUsers = async email => {
		const q = collection(db, 'videos');
		const snapshot = await getDocs(q);

		snapshot.docs.forEach(doc => {
			let message = [];
			message.push({ ...doc.data(), id: doc.id });

			const messages = message.filter(item => item.email === email);
			messages.map(item => setUser(item.id));
		});
	};
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const { uid, email } = user;
				setUserId(uid, email);
				getUsers(email);
			} else {
				navigate('/auth/login');
			}
		});
	}, []);
	return (
		<div className='min-h-screen grow-0 '>
			<Layout>
				<Sider
					trigger={null}
					unselectable='off'
					collapsible
					collapsed={collapsed}
					className='absolute top-0 right-0 h-auto '
				>
					<div className='demo-logo-vertical' />
					<Menu
						theme='dark'
						defaultSelectedKeys={['1']}
						items={[
							{
								key: 'home',
								icon: <HomeOutlined />,
								label: 'home',
								onClick: () => navigate('/'),
							},
							{
								key: 'Profil',
								icon: <UserOutlined />,
								label: 'Profile',
								onClick: () => navigate(`/profile/${user}`),
							},
							{
								key: 'Live',
								icon: <VideoCameraOutlined />,
								label: 'Live',
							},
							{
								key: 'Upload',
								icon: <UploadOutlined />,
								label: 'Upload',
								onClick: () => navigate(`/upload/${uiid}`),
							},
							{
								key: 'Chat',
								icon: <MessageOutlined />,
								label: 'Chat',
								onClick: () => navigate(`/chat/${userId}`),
							},
						]}
					/>
				</Sider>
				<Layout>
					<Header
						style={{
							padding: 0,
							background: colorBgContainer,
						}}
					>
						<Button
							type='text'
							icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
							onClick={() => setCollapsed(!collapsed)}
							style={{
								fontSize: '16px',
								width: 64,
								height: 64,
							}}
						/>
					</Header>
					<Content
						style={{
							margin: '24px 16px',
							padding: 24,
							minHeight: '130vh',
							background: colorBgContainer,
							borderRadius: borderRadiusLG,
							overflowX: 'scroll',
						}}
					>
						<div>
							<Outlet />
						</div>
					</Content>
				</Layout>
			</Layout>
		</div>
	);
}
