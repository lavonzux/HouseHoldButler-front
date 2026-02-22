// src/components/Layout/AuthLayout.tsx
import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Avatar, Space } from 'antd';
import {
  DashboardOutlined, InboxOutlined, BellOutlined,
  DollarOutlined, SettingOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import zhTW from 'antd/locale/zh_TW';
import { ConfigProvider, Typography } from 'antd';
const { Title } = Typography;
import { themeConfig, VIEW_TITLES } from '@/theme.ts';

const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '總覽' },
  { key: '/inventory', icon: <InboxOutlined />, label: '庫存清單' },
  { key: '/reminders', icon: <BellOutlined />, label: '提醒事項' },
  { key: '/budget', icon: <DollarOutlined />, label: '預算追蹤' },
  { key: '/settings', icon: <SettingOutlined />, label: '設定' },
];

const AuthLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = location.pathname;

  return (
    <ConfigProvider theme={themeConfig} locale={zhTW}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
          width={200}
          collapsedWidth={80}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              background: '#002140',
              cursor: 'pointer',           // 加上手型提示
            }}
            onClick={() => navigate('/')}   // ← 點擊跳轉到首頁
            role="button"                 // 提升可訪問性
            tabIndex={0}                  // 可聚焦
          >
            <img
              src="/houseHoldButlerLogo.png"
              alt="AI 管家 Logo"
              style={{ height: 20, width: 'auto', margin: '6px' }}
            />
            <Title style={{ color: '#fff', fontSize: 18, fontWeight: 600,  }}>
              AI 智慧家庭管家
            </Title>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />

          {!collapsed && (
            <div style={{
              position: 'absolute',
              bottom: 48,
              left: 0,
              right: 0,
              padding: 16,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <Avatar style={{ backgroundColor: '#1677ff' }}>A</Avatar>
              <div>
                <div style={{ color: '#fff', fontSize: 13 }}>Anthony's Home</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>管理員</div>
              </div>
            </div>
          )}
        </Sider>

        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Space>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              <span style={{ fontSize: 18, fontWeight: 500 }}>
                {VIEW_TITLES[location.pathname.replace('/', '')] || '總覽'}
              </span>
            </Space>

            <Space>
              <Badge count={3}>
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
              <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
            </Space>
          </Header>

          <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AuthLayout;