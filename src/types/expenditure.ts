import type { Dayjs} from "dayjs";

// 定義後端支出端點回傳資料類型
export interface ExpenditureItem {
  id: string;
  productName: string;       // 物品名稱（來自 Product 或手動輸入）
  category: string;          // 分類名稱
  categoryId?: string;       // 分類 Id 可選填
  amount: number;            // 支出金額
  expenditureDate: string;   // ISO 格式 "2026-03-10"
  description?: string;      // 說明
  source?: string;           // 支付來源，例如 "現金"、"信用卡"、"LINE Pay"
  createdAt: string;         // 建立時間
  updatedAt: string;         // 更新時間
}

// 定義支出編輯表單資料類型
export type ExpenditureFormData = {
  productName: string;       // 物品名稱
  categoryId: string;        // 分類 Id 
  category: string;          // 分類名稱
  amount: number;            // 支出金額
  expenditureDate: Dayjs | null; // 支出日期
  description?: string;      // 說明
  source: string;            // 支出來源
};

// 定義支出編輯表單資料類型
export type ExpenditureFormDataOfRequest = {
  productName: string;       // 物品名稱
  categoryId: string;        // 分類 Id 
  category: string;          // 分類名稱
  amount: number;            // 支出金額
  expenditureDate: string | null;   // 支出日期
  description?: string;      // 說明
  source: string;            // 支出來源
};