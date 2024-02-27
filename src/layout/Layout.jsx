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
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
const { Header, Sider, Content } = Layout;

export default function LayoutComponent({ uiid }) {
	const [collapsed, setCollapsed] = useState(false);
	const [userId, setUserId] = useState(0);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const navigate = useNavigate();

	if (typeof window != 'undefined' && window.document) {
		document.body.style.overflow = 'hidden';
	}
	useEffect(() => {
		onAuthStateChanged(auth, user => {
			if (user) {
				const { uid } = user;
				setUserId(uid);
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
					className='absolute top-0 right-0 h-auto'
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
								onClick: () => navigate('/profile'),
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
							border: '1px solid green',
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
