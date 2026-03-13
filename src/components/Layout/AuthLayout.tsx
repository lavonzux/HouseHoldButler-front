import React, { useState } from 'react';
import { Layout, Menu, Button, Badge, Avatar, Space, Dropdown, Tag } from 'antd';
import {
  DashboardOutlined, InboxOutlined, BellOutlined,
  DollarOutlined, SettingOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, UserOutlined, LogoutOutlined, 
  ShoppingCartOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import zhTW from 'antd/locale/zh_TW';
import { ConfigProvider, Typography } from 'antd';
const { Title } = Typography;
import { themeConfig, VIEW_TITLES } from '@/theme.ts';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';

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

  // 在 AuthLayout 元件內部，取得 context 資料
  const { user, logout } = useAuth();
  const { notifications, totalUnreadCount, markInventroyNoticesAsRead} = useNotifications();

  // 只取前 3 筆（可依需求調整）
  const recentNotifications = notifications.slice(0, 3);

  // 定義通知下拉選單內容
  const notificationMenuItems: MenuProps['items'] = [
    // 標題行（不可點擊）
    {
      key: 'header',
      label: (
        <div style={{ padding: '8px 12px', fontWeight: 600, color: '#f5222d' }}>
          提醒事項
          <span style={{ float: 'right', color: '#f5222d' }}>
            {totalUnreadCount} 則未讀
          </span>
        </div>
      ),
      disabled: true,
    },
    // 分隔線
    { type: 'divider' },
    // 前幾筆提醒
    ...recentNotifications.map((item) => ({
      key: `notif-${item.id}`,
      label: (
        <div style={{ padding: '8px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar
              size="small"
              icon={
                item.reminderType === 'LOW_STOCK' 
                  ? <ShoppingCartOutlined /> 
                  : <ClockCircleOutlined />
              }
            />
            <div style={{ flex: 1 }}>
              <div>
                <strong>{item.Name}</strong>
              </div>
              <div style={{ fontSize: 13, marginTop: 2 }}>
                {item.message}
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                {item.sentAt}
              </div>
            </div>
          </div>
        </div>
      ),
      onClick: () => {
        markInventroyNoticesAsRead(item.id);
        navigate('/reminders');
      },
    })),
    // 如果沒有提醒，顯示空狀態
    ...(recentNotifications.length === 0
      ? [{
          key: 'empty',
          label: <div style={{ padding: '16px', textAlign: 'center', color: '#8c8c8c' }}>目前沒有新提醒</div>,
          disabled: true,
        }]
      : []),
    // 分隔線 + 查看全部
    { type: 'divider' },
    {
      key: 'view-all',
      label: (
        <div style={{ textAlign: 'center', padding: '8px 0', backgroundColor: '#1677ff', color: '#fff', borderRadius: 4 }}>
          查看所有提醒事項
        </div>
      ),
      onClick: () => navigate('/reminders'),
    },
  ];

  // 定義使用者選單內容
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      onClick: logout,
    },
  ];

  const selectedKey = location.pathname;

  return (
    <ConfigProvider theme={themeConfig} locale={zhTW}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
          width={220}
          collapsedWidth={100}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              background: '#002140',
              cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
              overflow: 'hidden',
            }}
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
          >
            <img
              src="/houseHoldButlerLogo.png"
              alt="AI 管家 Logo"
              style={{ height: 20, width: 'auto', margin: '6px', flexShrink: 0 }}
            />
            {!collapsed && (
              <Title style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0, whiteSpace: 'nowrap' }}>
                AI 智慧家庭管家
              </Title>
            )}
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
              <Avatar style={{ backgroundColor: '#1677ff' }}>
                {user?.email?.[0]?.toUpperCase() ?? 'U'}
              </Avatar>
              <div>
                <div style={{ color: '#fff', fontSize: 13 }}>{user?.email ?? ''}</div>
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

            <Space size="middle">
              <Dropdown
                menu={{ items: notificationMenuItems}}
                trigger={['click']}
                placement="bottomRight"
              >
                <Badge count={totalUnreadCount}>
                  <Avatar style={{ backgroundColor: '#1677ff', cursor: 'pointer' }} size="default" icon={<BellOutlined />} />
                </Badge>
              </Dropdown>              
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Avatar style={{ backgroundColor: '#1677ff', cursor: 'pointer' }} icon={<UserOutlined />} />
              </Dropdown>
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