// ============================================
// Dashboard.tsx - 總覽頁面
// ============================================
// 
// TypeScript 學習重點：
// 1. React.FC<Props> 定義函數元件型別
// 2. 使用泛型 <T> 來定義可重用的型別
// 3. 事件處理函式的型別
// 4. 使用 useMemo 時的型別推斷
// ============================================

import React, { useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Badge, 
  Tag, 
  Button, 
  Select,
  Space,
  Typography,
  List,
} from 'antd';
import { 
  PlusOutlined,
  InboxOutlined,
  AlertOutlined,
  WarningOutlined,
  DollarOutlined,
  EditOutlined,
  ScanOutlined,
  ShoppingCartOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import type { DashboardProps, InventoryItem } from './types';
import { mockInventory } from './mockData';

const { Title, Text } = Typography;

/**
 * 統計卡片資料介面
 */
interface StatItem {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
}

/**
 * 快速操作項目介面
 */
interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

/**
 * Dashboard 元件
 * 使用 React.FC<Props> 定義函數元件的型別
 */
const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate,
  onSelectItem,
  onAddNew,
}) => {
  
  // 使用 useMemo 優化效能，TypeScript 會自動推斷回傳型別
  const criticalItems = useMemo<InventoryItem[]>(
    () => mockInventory.filter(item => item.status === 'critical'),
    []
  );
  
  const warningItems = useMemo<InventoryItem[]>(
    () => mockInventory.filter(item => item.status === 'warning'),
    []
  );

  // 統計卡片資料
  const stats: StatItem[] = [
    { 
      title: '總物品數', 
      value: mockInventory.length, 
      icon: <InboxOutlined />,
      color: '#1677ff',
    },
    { 
      title: '緊急補貨', 
      value: criticalItems.length, 
      icon: <AlertOutlined />,
      color: '#ff4d4f',
    },
    { 
      title: '即將用完', 
      value: warningItems.length, 
      icon: <WarningOutlined />,
      color: '#faad14',
    },
    { 
      title: '本月支出', 
      value: 12450, 
      prefix: 'NT$',
      icon: <DollarOutlined />,
      color: '#52c41a',
    },
  ];

  // 快速操作
  const quickActions: QuickAction[] = [
    { icon: <EditOutlined />, label: '記錄消耗' },
    { icon: <ScanOutlined />, label: '掃描條碼' },
    { icon: <ShoppingCartOutlined />, label: '購物清單' },
    { icon: <RobotOutlined />, label: 'AI 建議' },
  ];

  /**
   * 處理物品點擊
   * 明確標註參數型別
   */
  const handleItemClick = (item: InventoryItem): void => {
    onSelectItem(item);
  };

  return (
    <div>
      {/* 頁面標題 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>總覽</Title>
          <Text type="secondary">2026年2月5日 星期四</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
          新增物品
        </Button>
      </div>

      {/* 統計卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 內容區塊 */}
      <Row gutter={16}>
        {/* 緊急事項 */}
        <Col span={8}>
          <Card 
            title={
              <Space>
                <AlertOutlined style={{ color: '#ff4d4f' }} />
                <span>需要立即處理</span>
              </Space>
            }
            extra={<Badge count={criticalItems.length} />}
          >
            {criticalItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#52c41a' }}>
                ✓ 目前沒有緊急事項
              </div>
            ) : (
              <List
                dataSource={criticalItems}
                renderItem={(item: InventoryItem) => (
                  <List.Item 
                    onClick={() => handleItemClick(item)}
                    style={{ cursor: 'pointer' }}
                    extra={<Tag color="red">補貨</Tag>}
                  >
                    <List.Item.Meta
                      title={item.name}
                      description={`剩餘 ${item.quantity} ${item.unit} · ${item.daysUntilEmpty} 天後用完`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* 庫存注意 */}
        <Col span={8}>
          <Card 
            title={
              <Space>
                <WarningOutlined style={{ color: '#faad14' }} />
                <span>庫存注意</span>
              </Space>
            }
            extra={<Badge count={warningItems.length} style={{ backgroundColor: '#faad14' }} />}
          >
            <List
              dataSource={warningItems}
              renderItem={(item: InventoryItem) => (
                <List.Item 
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: 'pointer' }}
                  extra={<Tag color="orange">注意</Tag>}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`剩餘 ${item.quantity} ${item.unit} · ${item.daysUntilEmpty} 天後用完`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 快速操作 */}
        <Col span={8}>
          <Card title="⚡ 快速操作">
            <Row gutter={[12, 12]}>
              {quickActions.map((action, index) => (
                <Col span={12} key={index}>
                  <Button 
                    block 
                    onClick={action.onClick}
                    style={{ 
                      height: 80, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{action.icon}</div>
                    <span>{action.label}</span>
                  </Button>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 消耗趨勢圖表 */}
        <Col span={16} style={{ marginTop: 16 }}>
          <Card 
            title="📊 本週消耗趨勢"
            extra={
              <Select 
                defaultValue="week" 
                style={{ width: 100 }}
                options={[
                  { value: 'week', label: '本週' },
                  { value: 'month', label: '本月' },
                ]}
              />
            }
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 160 }}>
              {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div 
                    style={{ 
                      width: 32, 
                      height: `${30 + Math.random() * 80}px`, 
                      backgroundColor: index === 3 ? '#1677ff' : '#f0f0f0', 
                      borderRadius: '4px 4px 0 0',
                    }} 
                  />
                  <Text type="secondary">{day}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
