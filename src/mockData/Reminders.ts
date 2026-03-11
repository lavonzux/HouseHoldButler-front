import type { Reminder } from '@/types/reminder'

export const mockReminders: Reminder[] = [
  {
    id: 1,
    reminderType: 'LOW_STOCK',
    reminderStatus: 'UNREAD', 
    sentAt: '2026-02-05T09:00:00Z',
    Name: '洗衣精',
    message: '庫存即將用完，建議 3 天內購買',
  },
  {
    id: 2,
    reminderType: 'LOW_STOCK',
    reminderStatus: 'UNREAD',
    sentAt: '2026-02-05T08:30:00Z',
    Name: '洗碗精',
    message: '庫存即將用完，建議 4 天內購買',
  },
  {
    id: 3,
    reminderType: 'EXPIRING',
    reminderStatus: 'UNREAD',
    sentAt: '2026-02-04T14:00:00Z',
    Name: '全脂牛奶',
    message: '將於 7 天後過期，請盡快使用或冷凍',
  },
  { 
    id: 4, 
    reminderType: 'LOW_STOCK',
    reminderStatus: 'UNREAD',
    sentAt: '2026-02-03T14:00:00Z',
    Name: '衛生紙', 
    message: '庫存即將用完，建議 4 天內購買',
  }
];