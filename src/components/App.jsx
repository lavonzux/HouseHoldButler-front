// ============================================
// App.jsx - 主應用程式
// ============================================
// 
// 使用的 Ant Design 元件：
// - Layout (Sider, Header, Content)
// - Menu, ConfigProvider, Avatar, Badge, Button
// ============================================

import React, { useState } from 'react';
import { Layout, Menu, ConfigProvider, Avatar, Badge, Button, Space } from 'antd';
import {
  DashboardOutlined,
  InboxOutlined,
  BellOutlined,
  DollarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import zhTW from 'antd/locale/zh_TW';
import { themeConfig } from './theme';

// 引入各頁面元件
import Dashboard from './Dashboard';
import Inventory from './Inventory';
import ItemDetail from './ItemDetail';
// import Reminders from './Reminders';
// import Budget from './Budget';
// import Settings from './Settings';
// import AddItemModal from './AddItemModal';

const { Sider, Header, Content } = Layout;

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // 選單項目
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '總覽' },
    { key: 'inventory', icon: <InboxOutlined />, label: '庫存清單' },
    { key: 'reminders', icon: <BellOutlined />, label: '提醒事項' },
    { key: 'budget', icon: <DollarOutlined />, label: '預算追蹤' },
    { key: 'settings', icon: <SettingOutlined />, label: '設定' },
  ];

  // 頁面標題
  const viewTitles = {
    dashboard: '總覽',
    inventory: '庫存清單',
    detail: '物品詳情',
    reminders: '提醒事項',
    budget: '預算追蹤',
    settings: '設定',
  };

  // 處理選擇物品
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setCurrentView('detail');
  };

  // 處理返回
  const handleBack = () => {
    setCurrentView('inventory');
    setSelectedItem(null);
  };

  // 渲染內容
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} onSelectItem={handleSelectItem} onAddNew={() => setShowAddModal(true)} />;
      case 'inventory':
        return <Inventory onSelectItem={handleSelectItem} onAddNew={() => setShowAddModal(true)} />;
      case 'detail':
        return selectedItem ? <ItemDetail item={selectedItem} onBack={handleBack} /> : null;
      // case 'reminders':
      //   return <Reminders />;
      // case 'budget':
      //   return <Budget />;
      // case 'settings':
      //   return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <ConfigProvider locale={zhTW} theme={themeConfig}>
      <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
        {/* 側邊欄 */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={200}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          {/* Logo */}
          <div style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span style={{ fontSize: 24 }}>🏠</span>
            {!collapsed && (
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 500, marginLeft: 12 }}>
                AI 管家
              </span>
            )}
          </div>

          {/* 選單 */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[currentView === 'detail' ? 'inventory' : currentView]}
            items={menuItems}
            onClick={({ key }) => setCurrentView(key)}
          />

          {/* 使用者資訊 */}
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

        {/* 主要內容區 */}
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          {/* 頂部導航 */}
          <Header style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}>
            <Space>
              <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
              />
              <span style={{ fontSize: 18, fontWeight: 500 }}>{viewTitles[currentView]}</span>
            </Space>
            <Space>
              <Badge count={3}>
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
              <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
            </Space>
          </Header>
        
          {/*內容區*/}
          <Content style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 'calc(100vh - 112px)',
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>

    </ConfigProvider>
  );
}
