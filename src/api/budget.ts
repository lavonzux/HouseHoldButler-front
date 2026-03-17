import apiClient from '@api/client';
import type { BudgetSummary, BudgetAlert } from '@/types/budget.ts';

export const budgetApi = {
    // 取得某月份的預算總覽
    getBudgetByMonth: async (yearMonth: string): Promise<BudgetSummary> => {
        // yearMonth 格式: "2026-02" → 轉為 "2026-02-01"
        const dateParam = `${yearMonth}-01`;
        const response = await apiClient.get<BudgetSummary>(`/api/Budget/getMonthlyBudget?yearMonth=${dateParam}`);
        return response.data;
    },

    // 取得預算警示通知清單
    getBudgetAlerts: async (yearMonth?: string): Promise<BudgetAlert[]> => {
        const dateParam = yearMonth ? `${yearMonth}-12` : '';
        const response = await apiClient.get<BudgetAlert[]>(`/api/Budget/getBudgetAlerts?yearMonth=${dateParam}`);
        return response.data;
    },

    // 取得未讀的預算警示通知數量
    getUnreadAlertCount: async (): Promise<number> => {
        const response = await apiClient.get<number>('/api/Budget/getUnreadAlertCount')
        return response.data;
    },

    // 標記單一預算警示通知為已讀
    markAlertAsRead: async (id: string): Promise<void> => {
        await apiClient.patch(`/api/Budget/markAlertAsRead/${id}`);
    },

    // 標記當月所有預算警示通知為已讀
    markAllAlertsAsRead: async (yearMonth?: string): Promise<void> => {
        const dateParam = yearMonth ? `${yearMonth}-01` : '';
        await apiClient.patch(`/api/Budget/markAllAlertsAsRead?yearMonth=${dateParam}`);
    }
}