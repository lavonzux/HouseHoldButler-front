import React, { useState, useMemo } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Segmented,
  List,
  Avatar,
  Badge,
  Pagination,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { Reminder, ReminderType } from "@/types/reminder";
import { mockReminders } from "@/mockData/Reminders";
import { useNotifications } from "@/context/NotificationContext";
import { getBudgetAlertMessage } from "@/types/budget";

const { Title, Text } = Typography;

// 每頁顯示幾筆預算警示通知
const PAGE_SIZE = 3;

// 篩選選項型別
type FilterType = "all" | ReminderType | "BUDGET";

// Reminders 元件
const Reminders: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  // 預算警示通知分頁狀態 : 切換 tab 時重置回第一頁
  const [budgetPage, setBudgetPage] = useState<number>(1);

  // 從 NotificationContext 取得預算警示通知資料、未讀預算警示通知數量、設定通知為已讀方法
  const { budgetAlerts, markBudgetAlertAsRead } = useNotifications();

  // 庫存篩選後的提醒事項
  const filteredReminders = useMemo((): Reminder[] => {
    if (filter === "all") return mockReminders;
    if (filter === "BUDGET") return [];
    return mockReminders.filter((r) => r.reminderType === filter);
  }, [filter]);

  // 更新篩選變更
  const handleFilterChange = (value: string | number): void => {
    setFilter(value as FilterType);
  };

  // 預算警示分頁計算，目前分頁顯示的那一批資料
  const pagedBudgetAlerts = useMemo(() => {
    const start = (budgetPage - 1) * PAGE_SIZE;
    return budgetAlerts.slice(start, start + PAGE_SIZE);
  }, [budgetAlerts, budgetPage]);

  // 目前分頁內還有幾筆未讀（決定「本頁全部已讀」按鈕是否可點）
  const currentPageUnreadCount = useMemo(
    () => pagedBudgetAlerts.filter((a) => !a.isRead).length,
    [pagedBudgetAlerts],
  );

  // 將目前分頁內所有未讀逐一標記為已讀
  const handleMarkPageAsRead = () => {
    pagedBudgetAlerts
      .filter((a) => !a.isRead)
      .forEach((a) => markBudgetAlertAsRead(a.id));
  };

  // 根據類型取得圖示
  const getIcon = (type: ReminderType): React.ReactNode => {
    switch (type) {
      case "LOW_STOCK":
        return <ShoppingCartOutlined />;
      case "EXPIRING":
        return <ClockCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  // 預算警示等級對應的 Avatar 背景色
  const getAlertAvatarColor = (level: string): string => {
    switch (level) {
      case "Warning60":
        return "#1677ff";
      case "Warning80":
        return "#fa8c16";
      case "Danger90":
        return "#ff4d4f";
      case "Critical100":
        return "#a8071a";
      default:
        return "#d9d9d9";
    }
  };

  return (
    <div>
      {/* 頁面標題 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            提醒事項
          </Title>
          <Text type="secondary">管理您的購買、過期提醒以及預算警示</Text>
        </div>
      </div>

      {/* 篩選器 */}
      <Segmented
        value={filter}
        onChange={handleFilterChange}
        options={[
          { value: "all", label: "全部" },
          { value: "LOW_STOCK", label: "🛒 補貨" },
          { value: "EXPIRING", label: "⏰ 過期" },
          { value: "BUDGET", label: "💰 預算" },
        ]}
        style={{ marginBottom: 16 }}
      />

      {/* 庫存提醒列表 */}
      {filter != "BUDGET" && (
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
      )}

      {/* 預算警示列表 */}
      {filter === "BUDGET" && (
        <>
          {/* 工具列：顯示筆數資訊 + 本頁全部已讀按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text type="secondary">
              {budgetAlerts.length > 0
                ? `共 ${budgetAlerts.length} 筆通知，第 ${(budgetPage - 1) * PAGE_SIZE + 1}–${Math.min(budgetPage * PAGE_SIZE, budgetAlerts.length)} 筆`
                : '目前沒有未讀的預算警示'
              }
            </Text>
            {budgetAlerts.length > 0 && (
              <Button
                size="small"
                icon={<CheckOutlined />}
                disabled={currentPageUnreadCount === 0}
                onClick={handleMarkPageAsRead}
              >
                本頁全部已讀
              </Button>
            )}
          </div>
 
          {/* 警示列表（只渲染當前分頁資料） */}
          <List
            dataSource={pagedBudgetAlerts}
            locale={{ emptyText: '目前沒有未讀的預算警示' }}
            renderItem={(alert) => (
              <Card style={{ marginBottom: 12 }}>
                <List.Item
                  actions={[
                    alert.isRead ? (
                      <Button
                        key="read"
                        size="small"
                        style={{
                          color: '#52c41a',
                          borderColor: '#52c41a',
                          backgroundColor: '#f6ffed',
                        }}
                        icon={<CheckOutlined />}
                        disabled
                      >
                        已讀
                      </Button>
                    ) : (
                      <Button
                        key="unread"
                        size="small"
                        onClick={() => markBudgetAlertAsRead(alert.id)}
                      >
                        未讀
                      </Button>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<DollarOutlined />}
                        style={{ backgroundColor: getAlertAvatarColor(alert.alertLevel) }}
                      />
                    }
                    title={
                      <Space>
                        <span>{alert.categoryName}</span>
                      </Space>
                    }
                    description={
                      <div>
                        <div>{getBudgetAlertMessage(alert)}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(alert.createdAt).toLocaleString('zh-TW')}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              </Card>
            )}
          />
 
          {/* 分頁控制：筆數不超過一頁時不顯示 */}
          {budgetAlerts.length > PAGE_SIZE && (
            <>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                  current={budgetPage}
                  pageSize={PAGE_SIZE}
                  total={budgetAlerts.length}
                  onChange={(page) => {
                    setBudgetPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  showSizeChanger={false}
                  showTotal={(total, range) =>
                    `第 ${range[0]}–${range[1]} 筆，共 ${total} 筆`
                  }
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Reminders;
