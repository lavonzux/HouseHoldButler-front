import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Button,
  Space, 
  Typography, 
  Segmented, 
  List, 
  Avatar,
} from 'antd';
import {
  ShoppingCartOutlined, 
  ClockCircleOutlined, 
  CheckOutlined,
} from '@ant-design/icons';
import type { Reminder, ReminderType } from '@/types/reminder';
import { mockReminders } from '@/mockData/Reminders';

const { Title, Text } = Typography;

// 篩選選項型別
type FilterType = 'all' | ReminderType;

// Reminders 元件
const Reminders: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  // 篩選後的提醒事項   
  const filteredReminders = useMemo((): Reminder[] => {
    if (filter === 'all') {
      return mockReminders;
    }
    return mockReminders.filter(r => r.reminderType === filter);
  }, [filter]);

  // 更新篩選變更  
  const handleFilterChange = (value: string | number): void => {
    setFilter(value as FilterType);
  };

  // 根據類型取得圖示
  const getIcon = (type: ReminderType): React.ReactNode => {
    switch (type) {
      case 'LOW_STOCK':
        return <ShoppingCartOutlined />;
      case 'EXPIRING':
        return <ClockCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  return (
    <div>
      {/* 頁面標題 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>提醒事項</Title>
          <Text type="secondary">管理您的購買與過期提醒</Text>
        </div>
      </div>

      {/* 篩選器 */}
      <Segmented
        value={filter}
        onChange={handleFilterChange}
        options={[
          { value: 'all', label: '全部' },
          { value: 'LOW_STOCK', label: '🛒 補貨' },
          { value: 'EXPIRING', label: '⏰ 過期' },
        ]}
        style={{ marginBottom: 16 }}
      />

      {/* 提醒列表 */}
      <List
        dataSource={filteredReminders}
        renderItem={(item: Reminder) => (
          <Card style={{ marginBottom: 12 }}>
            <List.Item
              actions={[
                <Button size="small" icon={<CheckOutlined />} key="complete">
                  完成
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getIcon(item.reminderType)} />}
                title={
                  <Space>
                    <span>{item.Name}</span>
                  </Space>
                }
                description={
                  <div>
                    <div>{item.message}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.sentAt}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
};

export default Reminders;
