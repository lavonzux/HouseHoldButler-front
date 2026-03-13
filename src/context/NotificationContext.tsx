import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockReminders } from '@/mockData/Reminders';
import type { Reminder } from '@/types/reminder';
import type { BudgetAlert } from '@/types/budget';
import { budgetApi } from '@/api/budget';

interface NotificationContextType {
  // 庫存提醒
  notifications: Reminder[];
  unreadCount: number;
  markInventroyNoticesAsRead: (id: number | string) => void;
  markAllInventoryNoticesAsRead: () => void;

  // 預算警示通知
  budgetAlerts: BudgetAlert[];
  unreadBudgetCount: number;
  markBudgetAlertAsRead: (id: string) => void;
  markAllBudgetAlertsAsRead: () => void;
  refreshBudgetAlerts: () => Promise<void>;

  // 合計未讀數（給鈴鐺 badge 使用）
  totalUnreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // 庫存提醒事項的部分
  const [notifications, setNotifications] = useState<Reminder[]>(mockReminders);

  const unreadCount = notifications.filter(n => n.reminderStatus === 'UNREAD').length;

  const markInventroyNoticesAsRead = (id: number | string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, reminderStatus: 'READ' } : n)
    );
  };

  const markAllInventoryNoticesAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, reminderStatus: 'READ' })));
  };

  // 預算警示通知的部分
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);

  const unreadBudgetCount = budgetAlerts.filter(a => !a.isRead).length;

  const refreshBudgetAlerts = useCallback(async() => {
    try {
      const alerts = await budgetApi.getBudgetAlerts('2026-01');
      setBudgetAlerts(alerts);
    } catch (err) {
      console.error('Failed to fetch budget alerts:', err);
    }
  }, [])

  // 標記單筆預算警示通知已讀 (呼叫 API)
  const markBudgetAlertAsRead = useCallback(async (id: string) => {
    setBudgetAlerts(prev => 
      prev.map(a => a.id === id ? { ...a, isRead: true, readAt: new Date().toISOString() } : a)
    );
    try {
      await budgetApi.markAlertAsRead(id);
    } catch (err) {
      // 若 API 失敗，則回滾
      setBudgetAlerts(prev =>
        prev.map(a => a.id === id ? { ...a, isRead: false, readAt: null } : a)
      )
      console.error('Failed to mark budget alert as read:', err);
    }
  }, [])

  // 標記全部預算警示通知已讀 (呼叫 API)
  const markAllBudgetAlertsAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    setBudgetAlerts(prev => prev.map(a => ({ ...a, isRead: true, readAt: now })));
    try {
      await budgetApi.markAllAlertsAsRead();
    } catch (err) {
      // 回滾：重新從後端取得
      await refreshBudgetAlerts(); 
      console.error('Failed to mark all budget alerts as read:', err);
    }
  }, [refreshBudgetAlerts]);

  // 初次載入時取得預算警示通知
  useEffect(() => {
    refreshBudgetAlerts();
  }, [refreshBudgetAlerts]);

  // 庫存提醒事項 + 預算警示通知 合計
  const totalUnreadCount = unreadCount + unreadBudgetCount;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markInventroyNoticesAsRead, 
      markAllInventoryNoticesAsRead,
      budgetAlerts,
      unreadBudgetCount,
      markBudgetAlertAsRead,
      markAllBudgetAlertsAsRead,
      refreshBudgetAlerts,
      totalUnreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};