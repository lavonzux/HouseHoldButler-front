// ============================================
// mockData.ts - 測試資料
// ============================================
// 
// TypeScript 學習重點：
// 1. 明確標註陣列型別 InventoryItem[]
// 2. 使用型別來確保資料結構正確
// 3. null vs undefined 的使用時機
// ============================================

import type { 
  InventoryItem, 
  Reminder, 
  BudgetCategory, 
  SelectOption,
  ConsumptionRecord,
} from './types';

/**
 * 庫存資料
 * 明確標註型別為 InventoryItem[]
 */
export const mockInventory: InventoryItem[] = [
  { 
    id: 1, 
    key: 1,
    name: '全脂牛奶', 
    category: '乳製品', 
    quantity: 2, 
    unit: '瓶', 
    consumptionRate: 0.5, 
    daysUntilEmpty: 4, 
    expiryDate: '2026-02-12', 
    location: '冰箱', 
    lastUpdated: '2026-02-03', 
    status: 'warning',
  },
  { 
    id: 2, 
    key: 2,
    name: '雞蛋', 
    category: '蛋類', 
    quantity: 18, 
    unit: '顆', 
    consumptionRate: 3, 
    daysUntilEmpty: 6, 
    expiryDate: '2026-02-20', 
    location: '冰箱', 
    lastUpdated: '2026-02-04', 
    status: 'ok',
  },
  { 
    id: 3, 
    key: 3,
    name: '白米', 
    category: '穀物', 
    quantity: 2.5, 
    unit: 'kg', 
    consumptionRate: 0.3, 
    daysUntilEmpty: 8, 
    expiryDate: '2026-08-15', 
    location: '儲藏室', 
    lastUpdated: '2026-02-01', 
    status: 'ok',
  },
  { 
    id: 4, 
    key: 4,
    name: '洗碗精', 
    category: '清潔用品', 
    quantity: 0.2, 
    unit: '瓶', 
    consumptionRate: 0.05, 
    daysUntilEmpty: 4, 
    expiryDate: null, // 清潔用品沒有有效期限，使用 null
    location: '廚房', 
    lastUpdated: '2026-02-02', 
    status: 'critical',
  },
  { 
    id: 5, 
    key: 5,
    name: '衛生紙', 
    category: '日用品', 
    quantity: 3, 
    unit: '包', 
    consumptionRate: 0.5, 
    daysUntilEmpty: 6, 
    expiryDate: null, 
    location: '浴室', 
    lastUpdated: '2026-02-04', 
    status: 'warning',
  },
  { 
    id: 6, 
    key: 6,
    name: '義大利麵', 
    category: '穀物', 
    quantity: 4, 
    unit: '包', 
    consumptionRate: 0.3, 
    daysUntilEmpty: 13, 
    expiryDate: '2027-01-10', 
    location: '儲藏室', 
    lastUpdated: '2026-01-28', 
    status: 'ok',
  },
  { 
    id: 7, 
    key: 7,
    name: '橄欖油', 
    category: '調味料', 
    quantity: 0.8, 
    unit: '瓶', 
    consumptionRate: 0.02, 
    daysUntilEmpty: 40, 
    expiryDate: '2026-12-01', 
    location: '廚房', 
    lastUpdated: '2026-02-01', 
    status: 'ok',
  },
  { 
    id: 8, 
    key: 8,
    name: '洗衣精', 
    category: '清潔用品', 
    quantity: 0.3, 
    unit: '瓶', 
    consumptionRate: 0.1, 
    daysUntilEmpty: 3, 
    expiryDate: null, 
    location: '陽台', 
    lastUpdated: '2026-02-03', 
    status: 'critical',
  },
];

/**
 * 分類選項
 */
export const mockCategories: SelectOption[] = [
  { value: '全部', label: '全部' },
  { value: '乳製品', label: '乳製品' },
  { value: '蛋類', label: '蛋類' },
  { value: '穀物', label: '穀物' },
  { value: '清潔用品', label: '清潔用品' },
  { value: '日用品', label: '日用品' },
  { value: '調味料', label: '調味料' },
];

/**
 * 位置選項
 */
export const mockLocations: SelectOption[] = [
  { value: '全部', label: '全部' },
  { value: '冰箱', label: '冰箱' },
  { value: '冷凍庫', label: '冷凍庫' },
  { value: '儲藏室', label: '儲藏室' },
  { value: '廚房', label: '廚房' },
  { value: '浴室', label: '浴室' },
  { value: '陽台', label: '陽台' },
];

/**
 * 提醒事項
 */
export const mockReminders: Reminder[] = [
  { 
    id: 1, 
    type: 'purchase', 
    item: '洗衣精', 
    message: '庫存即將用完，建議 3 天內購買', 
    priority: 'high', 
    time: '今天',
  },
  { 
    id: 2, 
    type: 'purchase', 
    item: '洗碗精', 
    message: '庫存即將用完，建議 4 天內購買', 
    priority: 'high', 
    time: '今天',
  },
  { 
    id: 3, 
    type: 'expiry', 
    item: '全脂牛奶', 
    message: '將於 7 天後過期', 
    priority: 'medium', 
    time: '2026-02-12',
  },
  { 
    id: 4, 
    type: 'purchase', 
    item: '衛生紙', 
    message: '庫存偏低，建議一週內購買', 
    priority: 'medium', 
    time: '明天',
  },
];

/**
 * 預算分類
 */
export const mockBudgetCategories: BudgetCategory[] = [
  { name: '食品', spent: 8500, budget: 10000, color: '#1677ff' },
  { name: '日用品', spent: 2200, budget: 3000, color: '#52c41a' },
  { name: '清潔用品', spent: 850, budget: 1500, color: '#faad14' },
  { name: '其他', spent: 900, budget: 2000, color: '#8c8c8c' },
];

/**
 * 單位選項
 */
export const unitOptions: SelectOption[] = [
  { value: '個', label: '個' },
  { value: '瓶', label: '瓶' },
  { value: '包', label: '包' },
  { value: '盒', label: '盒' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'L', label: 'L' },
  { value: 'ml', label: 'ml' },
];

/**
 * 消耗紀錄範例
 * 注意 note 是可選屬性，可以省略
 */
export const mockConsumptionHistory: ConsumptionRecord[] = [
  { date: '2026-02-04', amount: 0.5, note: '早餐使用' },
  { date: '2026-02-03', amount: 0.5 }, // 沒有 note
  { date: '2026-02-02', amount: 1, note: '做蛋糕' },
  { date: '2026-02-01', amount: 0.5 },
];

// ============================================
// 輔助函式 - 帶有型別的函式範例
// ============================================

/**
 * 根據狀態篩選庫存
 * @param items - 庫存陣列
 * @param status - 要篩選的狀態
 * @returns 篩選後的庫存陣列
 */
export function filterByStatus(
  items: InventoryItem[], 
  status: InventoryItem['status']
): InventoryItem[] {
  return items.filter(item => item.status === status);
}

/**
 * 計算預算總計
 * @param categories - 預算分類陣列
 * @returns 包含總支出和總預算的物件
 */
export function calculateBudgetTotal(
  categories: BudgetCategory[]
): { spent: number; budget: number; percentage: number } {
  const result = categories.reduce(
    (acc, cat) => ({
      spent: acc.spent + cat.spent,
      budget: acc.budget + cat.budget,
    }),
    { spent: 0, budget: 0 }
  );
  
  return {
    ...result,
    percentage: Math.round((result.spent / result.budget) * 100),
  };
}
