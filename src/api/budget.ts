import apiClient from '@api/client';
import type { BudgetSummary } from '@/types/budget.ts';

export const budgetApi = {
    getBudgetByMonth: async (yearMonth: string): Promise<BudgetSummary> => {
        // yearMonth 格式: "2026-02" → 轉為 "2026-02-01"
        const dateParam = `${yearMonth}-01`;
        const response = await apiClient.get<BudgetSummary>(`/api/Budget/getMonthlyBudget?yearMonth=${dateParam}`);
        return response.data;
    }
}