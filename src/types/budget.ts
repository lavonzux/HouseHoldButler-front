// 預算相關的 TypeScript 類型定義
export interface BudgetCategory {
  categoryId: string;
  categoryName: string;
  icon: string;
  budgetAmount: number;
  actualSpent: number;
  percentage: number;
}

// 後端回傳的預算總覽資料結構
export interface BudgetSummary {
  yearMonth: string;
  totalBudget: number;
  totalSpent: number;
  totalPercentage: number;
  categories: BudgetCategory[];
}