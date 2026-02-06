// ============================================
// theme.js - Ant Design Theme Configuration
// ============================================
// 
// 這個檔案定義了 Ant Design 的主題配置
// 可以在 ConfigProvider 中使用這些設定來自訂主題
//
// 使用方式：
// import { ConfigProvider } from 'antd';
// import { themeConfig } from './theme';
// 
// <ConfigProvider theme={themeConfig}>
//   <App />
// </ConfigProvider>
// ============================================

// Ant Design 5.x 主題配置
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
};

// 狀態配置 - 用於庫存狀態顯示
export const statusConfig = {
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

// 側邊欄寬度
export const SIDER_WIDTH = 200;
export const SIDER_COLLAPSED_WIDTH = 80;
