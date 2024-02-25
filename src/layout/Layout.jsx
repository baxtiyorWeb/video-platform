import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

export default function LayoutComponent() {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const navigate = useNavigate();
	return (
		<div>
			<div className='min-h-screen grow-0 '>
				<Layout>
					<Sider trigger={null} collapsible collapsed={collapsed}>
						<div className='demo-logo-vertical' />
						<Menu
							theme='dark'
							mode='inline'
							defaultSelectedKeys={['1']}
							items={[
								{
									key: 'home',
									icon: <UserOutlined />,
									label: 'home',
									onClick: () => navigate('/'),
								},
								{
									key: 'Profil',
									icon: <UserOutlined />,
									label: 'Profile',
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
									onClick: () => navigate('/upload'),
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
								minHeight: '100vh',
								background: colorBgContainer,
								borderRadius: borderRadiusLG,
							}}
						>
							<Outlet />
						</Content>
					</Layout>
				</Layout>
			</div>
		</div>
	);
}
