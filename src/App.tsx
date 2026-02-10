// ============================================
// App.tsx - 主應用程式
// ============================================
// 
// TypeScript 學習重點：
// 1. 條件型別和型別守衛
// 2. React Router 的型別 (如果使用)
// 3. 狀態管理的型別安全
// ============================================

import React, { useState, useCallback } from 'react';
import { 
  Layout, 
  Menu, 
  ConfigProvider, 
  Avatar, 
  Badge, 
  Button, 
  Space,
} from 'antd';
import type { MenuProps } from 'antd';
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

import type { ViewName, InventoryItem } from './types';
import { themeConfig, VIEW_TITLES } from './theme';

// 引入各頁面元件
import Dashboard from './Dashboard';
import Inventory from './Inventory';
import ItemDetail from './ItemDetail';
import Reminders from './Reminders';
import Budget from './Budget';
import Settings from './Settings';
import AddItemModal from './AddItemModal';

const { Sider, Header, Content } = Layout;

/**
 * 選單項目型別
 * 使用 Ant Design 的 MenuProps['items'] 型別
 */
type MenuItem = Required<MenuProps>['items'][number];

/**
 * App 元件
 */
const App: React.FC = () => {
  // 狀態定義，使用泛型指定型別
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  /**
   * 選單項目
   */
  const menuItems: MenuItem[] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '總覽' },
    { key: 'inventory', icon: <InboxOutlined />, label: '庫存清單' },
    { key: 'reminders', icon: <BellOutlined />, label: '提醒事項' },
    { key: 'budget', icon: <DollarOutlined />, label: '預算追蹤' },
    { key: 'settings', icon: <SettingOutlined />, label: '設定' },
  ];

  /**
   * 處理選單點擊
   * 使用 useCallback 優化效能
   */
  const handleMenuClick = useCallback((info: { key: string }): void => {
    setCurrentView(info.key as ViewName);
  }, []);

  /**
   * 處理選擇物品
   */
  const handleSelectItem = useCallback((item: InventoryItem): void => {
    setSelectedItem(item);
    setCurrentView('detail');
  }, []);

  /**
   * 處理返回
   */
  const handleBack = useCallback((): void => {
    setCurrentView('inventory');
    setSelectedItem(null);
  }, []);

  /**
   * 處理新增物品
   */
  const handleAddNew = useCallback((): void => {
    setShowAddModal(true);
  }, []);

  /**
   * 處理關閉新增 Modal
   */
  const handleCloseModal = useCallback((): void => {
    setShowAddModal(false);
  }, []);

  /**
   * 渲染內容
   * 根據當前視圖渲染對應的元件
   */
  const renderContent = (): React.ReactNode => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setCurrentView} 
            onSelectItem={handleSelectItem} 
            onAddNew={handleAddNew} 
          />
        );
      case 'inventory':
        return (
          <Inventory 
            onSelectItem={handleSelectItem} 
            onAddNew={handleAddNew} 
          />
        );
      case 'detail':
        // 型別守衛：確保 selectedItem 不為 null
        if (selectedItem === null) {
          return null;
        }
        return (
          <ItemDetail 
            item={selectedItem} 
            onBack={handleBack} 
          />
        );
      case 'reminders':
        return <Reminders />;
      case 'budget':
        return <Budget />;
      case 'settings':
        return <Settings />;
      default:
        // TypeScript 會確保所有情況都被處理
        // 如果有遺漏的 case，這裡會報錯
        return <Dashboard onNavigate={setCurrentView} onSelectItem={handleSelectItem} onAddNew={handleAddNew} />;
    }
  };

  /**
   * 計算當前選中的選單 key
   */
  const selectedMenuKey: string = currentView === 'detail' ? 'inventory' : currentView;

  return (
    <ConfigProvider locale={zhTW} theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
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
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span style={{ fontSize: 24 }}>🏠</span>
            {!collapsed && (
              <span
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 500,
                  marginLeft: 12,
                }}
              >
                AI 管家
              </span>
            )}
          </div>

          {/* 選單 */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedMenuKey]}
            items={menuItems}
            onClick={handleMenuClick}
          />

          {/* 使用者資訊 */}
          {!collapsed && (
            <div
              style={{
                position: 'absolute',
                bottom: 48,
                left: 0,
                right: 0,
                padding: 16,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Avatar style={{ backgroundColor: '#1677ff' }}>A</Avatar>
              <div>
                <div style={{ color: '#fff', fontSize: 13 }}>Anthony's Home</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>
                  管理員
                </div>
              </div>
            </div>
          )}
        </Sider>

        {/* 主要內容區 */}
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: 'margin-left 0.2s',
          }}
        >
          {/* 頂部導航 */}
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
                {VIEW_TITLES[currentView]}
              </span>
            </Space>
            <Space>
              <Badge count={3}>
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
              <Avatar
                style={{ backgroundColor: '#1677ff' }}
                icon={<UserOutlined />}
              />
            </Space>
          </Header>

          {/* 內容區 */}
          <Content
            style={{
              margin: 24,
              padding: 24,
              background: '#fff',
              borderRadius: 8,
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>

      {/* 新增物品 Modal */}
      <AddItemModal open={showAddModal} onClose={handleCloseModal} />
    </ConfigProvider>
  );
};

export default App;
