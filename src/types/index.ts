// ============================================
// types/index.ts - 型別定義
// ============================================
// 
// TypeScript 學習重點：
// 1. interface vs type - 兩者都可以定義物件型別
//    - interface 可以被擴展 (extends)，適合定義物件結構
//    - type 更靈活，可以定義聯合型別、元組等
// 2. 使用 | 定義聯合型別 (Union Types)
// 3. 使用 ? 標記可選屬性
// 4. 使用 readonly 標記唯讀屬性
// ============================================

/**
 * 庫存狀態 - 使用聯合型別 (Union Type)
 * 只能是這三個值之一
 */
export type InventoryStatus = 'critical' | 'warning' | 'ok';

/**
 * 提醒類型
 */
export type ReminderType = 'purchase' | 'expiry' | 'custom';

/**
 * 提醒優先級
 */
export type ReminderPriority = 'high' | 'medium' | 'low';

/**
 * 視圖模式
 */
export type ViewMode = 'table' | 'grid';

/**
 * 頁面/路由名稱
 */
export type ViewName = 'dashboard' | 'inventory' | 'detail' | 'reminders' | 'budget' | 'settings';

/**
 * 庫存物品介面
 * 使用 interface 定義物件結構
 */
export interface InventoryItem {
  /** 唯一識別碼 */
  id: number;
  /** Ant Design Table 需要的 key */
  key: number;
  /** 物品名稱 */
  name: string;
  /** 分類 */
  category: string;
  /** 數量 */
  quantity: number;
  /** 單位 */
  unit: string;
  /** 每日消耗率 */
  consumptionRate: number;
  /** 預計幾天後用完 */
  daysUntilEmpty: number;
  /** 有效期限（可選，清潔用品可能沒有） */
  expiryDate: string | null;
  /** 存放位置 */
  location: string;
  /** 最後更新日期 */
  lastUpdated: string;
  /** 狀態 */
  status: InventoryStatus;
}

/**
 * 提醒事項介面
 */
export interface Reminder {
  id: number;
  type: ReminderType;
  item: string;
  message: string;
  priority: ReminderPriority;
  time: string;
}

/**
 * 預算分類介面
 */
export interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

/**
 * 消耗紀錄介面
 */
export interface ConsumptionRecord {
  date: string;
  amount: number;
  note?: string; // 可選屬性
}

/**
 * 選項介面 - 用於 Select 元件
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * 狀態配置介面
 */
export interface StatusConfig {
  label: string;
  color: string;
  tagColor: string;
  badgeStatus: 'success' | 'warning' | 'error' | 'processing' | 'default';
}

/**
 * 狀態配置映射型別
 * 使用 Record 工具型別來定義鍵值對
 */
export type StatusConfigMap = Record<InventoryStatus, StatusConfig>;

/**
 * 通知設定介面
 */
export interface NotificationSettings {
  purchase: boolean;
  expiry: boolean;
  daily: boolean;
}

/**
 * 新增物品表單資料
 */
export interface AddItemFormData {
  name: string;
  category: string;
  quantity: number | null;
  unit: string;
  location: string;
  expiryDate: string | null;
  consumptionRate: number | null;
}

// ============================================
// 元件 Props 型別定義
// ============================================

/**
 * Dashboard 元件的 Props
 */
export interface DashboardProps {
  onNavigate: (view: ViewName) => void;
  onSelectItem: (item: InventoryItem) => void;
  onAddNew: () => void;
}

/**
 * Inventory 元件的 Props
 */
export interface InventoryProps {
  onSelectItem: (item: InventoryItem) => void;
  onAddNew: () => void;
}

/**
 * ItemDetail 元件的 Props (待刪除)
 */
// export interface ItemDetailProps {
//   item: InventoryItem;
//   onBack: () => void;
// }

/**
 * AddItemModal 元件的 Props
 */
export interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AddItemFormData) => void;
}

/**
 * Sidebar 元件的 Props
 */
export interface SidebarProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

// ============================================
// 工具型別 (Utility Types) 範例
// ============================================

/**
 * 使用 Partial 讓所有屬性變成可選
 * 適用於更新操作，只需要傳入要更新的欄位
 */
export type PartialInventoryItem = Partial<InventoryItem>;

/**
 * 使用 Pick 選取部分屬性
 * 適用於只需要顯示部分資訊的場景
 */
export type InventoryItemSummary = Pick<InventoryItem, 'id' | 'name' | 'quantity' | 'unit' | 'status'>;

/**
 * 使用 Omit 排除部分屬性
 * 適用於新增操作，id 由後端產生
 */
export type NewInventoryItem = Omit<InventoryItem, 'id' | 'key' | 'lastUpdated'>;

/**
 * 使用 Readonly 讓所有屬性變成唯讀
 */
export type ReadonlyInventoryItem = Readonly<InventoryItem>;
