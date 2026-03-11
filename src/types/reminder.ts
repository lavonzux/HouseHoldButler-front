// 提醒類型 : 庫存過低、即將過期、預估耗盡
export type ReminderType = 'LOW_STOCK' | 'EXPIRING' | 'DEPLETION_ESTIMATED';

// 提醒狀態 : 待發送、已發送、已忽略、已延後
export type ReminderStatus = 'PENDING' | 'SENT' | 'DISMISSED' | 'SNOOZED' | 'READ' | 'UNREAD';

export interface Reminder {
  id: number | string;               // mock 用 number，後端用 Guid → string
  inventoryId?: number | string;
  reminderType: ReminderType;
  reminderStatus: ReminderStatus;
  sentAt?: string | null;
  scheduledAt?: string;              // ISO string
  snoozedUntil?: string | null;
  
  // 前端衍生/展示用欄位
  Name: string;                  // 商品名稱 (從 join inventory 以及 product 資料表取得 Name)
  message: string;                   // 根據 ReminderType 決定使用該字串模板 (天數的部分可以根據預估消耗跟過期日期進行計算)
//   priority: 'high' | 'medium' | 'low'; // 暫時無此需求，先註解掉
}