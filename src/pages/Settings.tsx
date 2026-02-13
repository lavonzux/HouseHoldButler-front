// ============================================
// Settings.tsx - 設定頁面
// ============================================

import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Switch, 
  Divider, 
  Typography,
} from 'antd';
import type { NotificationSettings } from '../types';

const { Title, Text } = Typography;

/**
 * 設定項目介面
 */
interface SettingItem {
  label: string;
  value?: string;
  description?: string;
}

/**
 * 通知設定項目介面
 */
interface NotificationSettingItem {
  key: keyof NotificationSettings;
  label: string;
  description: string;
}

/**
 * Settings 元件
 */
const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    purchase: true,
    expiry: true,
    daily: false,
  });

  /**
   * 處理通知設定變更
   * 使用泛型確保 key 是 NotificationSettings 的鍵
   */
  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean): void => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // 帳號設定項目
  const accountSettings: SettingItem[] = [
    { label: '家庭名稱', value: "Anthony's Home" },
    { label: '成員管理', value: '2 位成員' },
  ];

  // 通知設定項目
  const notificationSettings: NotificationSettingItem[] = [
    { key: 'purchase', label: '補貨提醒', description: '庫存低於設定值時通知' },
    { key: 'expiry', label: '過期提醒', description: '物品即將過期時通知' },
    { key: 'daily', label: '每日摘要', description: '每天早上發送庫存摘要' },
  ];

  // 資料管理項目
  const dataManagementItems: SettingItem[] = [
    { label: '匯出資料', description: '匯出所有庫存與紀錄（CSV/JSON）' },
    { label: '匯入資料', description: '從檔案匯入庫存資料' },
  ];

  return (
    <div>
      {/* 頁面標題 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>設定</Title>
        <Text type="secondary">自訂您的 AI Housekeeper</Text>
      </div>

      {/* 帳號設定 */}
      <Card title="帳號設定" style={{ marginBottom: 16 }}>
        {accountSettings.map((item, index) => (
          <React.Fragment key={item.label}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 0',
            }}>
              <div>
                <Text strong>{item.label}</Text>
                <br />
                <Text type="secondary">{item.value}</Text>
              </div>
              <Button type="link">編輯</Button>
            </div>
            {index < accountSettings.length - 1 && <Divider style={{ margin: 0 }} />}
          </React.Fragment>
        ))}
      </Card>

      {/* 通知設定 */}
      <Card title="通知設定" style={{ marginBottom: 16 }}>
        {notificationSettings.map((item, index) => (
          <React.Fragment key={item.key}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 0',
            }}>
              <div>
                <Text strong>{item.label}</Text>
                <br />
                <Text type="secondary">{item.description}</Text>
              </div>
              <Switch
                checked={notifications[item.key]}
                onChange={(checked: boolean) => handleNotificationChange(item.key, checked)}
              />
            </div>
            {index < notificationSettings.length - 1 && <Divider style={{ margin: 0 }} />}
          </React.Fragment>
        ))}
      </Card>

      {/* 資料管理 */}
      <Card title="資料管理">
        {dataManagementItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 0',
            }}>
              <div>
                <Text strong>{item.label}</Text>
                <br />
                <Text type="secondary">{item.description}</Text>
              </div>
              <Button>{item.label.slice(0, 2)}</Button>
            </div>
            {index < dataManagementItems.length - 1 && <Divider style={{ margin: 0 }} />}
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
};

export default Settings;
