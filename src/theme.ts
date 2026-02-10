// ============================================
// theme.ts - Ant Design 主題配置
// ============================================
// 
// TypeScript 學習重點：
// 1. 使用 as const 斷言來建立字面量型別
// 2. 從 antd 匯入型別定義
// 3. 使用 satisfies 來檢查型別同時保留推斷
// ============================================

import type { ThemeConfig } from 'antd';
import type { StatusConfigMap } from './types';

/**
 * Ant Design 5.x 主題配置
 * 使用 satisfies 確保型別正確，同時保留具體的值推斷
 */
export const themeConfig = {
  token: {
    // 品牌色
    colorPrimary: '#1677ff',
    
    // 成功、警告、錯誤色
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    
    // 圓角
    borderRadius: 6,
    
    // 字體
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#ffffff',
      headerHeight: 64,
    },
    Menu: {
      darkItemBg: '#001529',
      darkItemSelectedBg: '#1677ff',
    },
  },
} satisfies ThemeConfig;

/**
 * 狀態配置
 * 用於根據庫存狀態顯示不同的顏色和標籤
 */
export const statusConfig: StatusConfigMap = {
  critical: { 
    label: '緊急', 
    color: 'error',
    tagColor: 'red',
    badgeStatus: 'error',
  },
  warning: { 
    label: '注意', 
    color: 'warning',
    tagColor: 'orange',
    badgeStatus: 'warning',
  },
  ok: { 
    label: '充足', 
    color: 'success',
    tagColor: 'green',
    badgeStatus: 'success',
  },
};

/**
 * 側邊欄寬度常數
 * 使用 as const 確保這些值是字面量型別而不是 number
 */
export const SIDER_WIDTH = 200 as const;
export const SIDER_COLLAPSED_WIDTH = 80 as const;

/**
 * 頁面標題映射
 * 使用 Record 型別來定義鍵值對
 */
export const VIEW_TITLES: Record<string, string> = {
  dashboard: '總覽',
  inventory: '庫存清單',
  detail: '物品詳情',
  reminders: '提醒事項',
  budget: '預算追蹤',
  settings: '設定',
};
