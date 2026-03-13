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

// 預算警示通知的類型定義
export type BudgetAlertLevel =
  | "Normal"
  | "Warning60"
  | "Warning80"
  | "Danger90"
  | "Critical100";

// 後端回傳的預算警示通知資料結構
export interface BudgetAlert {
  id: string;
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string | null;
  yearMonth: string;
  alertLevel: BudgetAlertLevel;
  percentage: number;
  isRead: boolean;
  readAt: string | null;
  lastNotifiedAt: string | null;
  createdAt: string;
}

// 根據 AlertLevel 產生對應的中文訊息
export function getBudgetAlertMessage(alert: BudgetAlert): string {
  const { categoryName, alertLevel, percentage } = alert;
  const pct = percentage.toFixed(1);

  switch (alertLevel) {
    case "Warning60":
      return `${categoryName} 的支出已達預算的 ${pct}%，請留意消費`;
    case "Warning80":
      return `${categoryName} 的支出已達預算的 ${pct}%，接近預算上限`;
    case "Danger90":
      return `⚠️ ${categoryName} 的支出已達預算的 ${pct}%，即將超支`;
    case "Critical100":
      return `🚨 ${categoryName} 的支出已達預算的 ${pct}%，已超出預算`;
    default:
      return `${categoryName} 預算使用率 ${pct}%`;
  }
}
