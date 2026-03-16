import apiClient from '@api/client';
import type { BudgetSummary, BudgetAlert, SetBudgetLimitsPayload, ExistingCategoryLimit } from '@/types/budget.ts';

export const budgetApi = {
    // 取得某月份的預算總覽
    getBudgetByMonth: async (yearMonth: string): Promise<BudgetSummary> => {
        // yearMonth 格式: "2026-02" → 轉為 "2026-02-01"
        const dateParam = `${yearMonth}-01`;
        const response = await apiClient.get<BudgetSummary>(`/api/Budget/getMonthlyBudget?yearMonth=${dateParam}`);
        return response.data;
    },
    
    getCategoryLimits: async (yearMonth: string): Promise<ExistingCategoryLimit[]> => {
        const dateParam = `${yearMonth}-01`;
        const response = await apiClient.get<ExistingCategoryLimit[]>(`/api/Budget/getCategoryLimits?yearMonth=${dateParam}`);
        return response.data;
    },

    // 批次刪除、新增/更新分類預算（Upsert）
    setBudgetLimits: async (payload: SetBudgetLimitsPayload): Promise<void> => {
        await apiClient.post('/api/Budget/setBudgetLimits', payload);
    },

    // 取得預算警示通知清單 (不限月份)
    getBudgetAlerts: async (): Promise<BudgetAlert[]> => {
        const response = await apiClient.get<BudgetAlert[]>('/api/Budget/getBudgetAlerts');
        return response.data;
    },

    // 取得未讀的預算警示通知數量 (不限月份)
    getUnreadAlertCount: async (): Promise<number> => {
        const response = await apiClient.get<number>('/api/Budget/getUnreadAlertCount')
        return response.data;
    },

    // 標記單一預算警示通知為已讀
    markAlertAsRead: async (id: string): Promise<void> => {
        await apiClient.patch(`/api/Budget/markAlertAsRead/${id}`);
    },

    // 標記所有未讀預算警示通知為已讀
    markAllAlertsAsRead: async (): Promise<void> => {
        await apiClient.patch('/api/Budget/markAllAlertsAsRead');
    }
}