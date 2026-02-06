import React, { useState } from 'react';

// ============================================
// AI Housekeeper - Ant Design Style Preview
// Simulates Ant Design look for Artifact preview
// ============================================

// ============================================
// 1. THEME - Ant Design Color Palette
// ============================================
const colors = {
  primary: '#1677ff',
  primaryHover: '#4096ff',
  primaryBg: '#e6f4ff',
  success: '#52c41a',
  successBg: '#f6ffed',
  warning: '#faad14',
  warningBg: '#fffbe6',
  error: '#ff4d4f',
  errorBg: '#fff2f0',
  text: 'rgba(0, 0, 0, 0.88)',
  textSecondary: 'rgba(0, 0, 0, 0.65)',
  textTertiary: 'rgba(0, 0, 0, 0.45)',
  border: '#d9d9d9',
  borderSecondary: '#f0f0f0',
  fill: '#f5f5f5',
  fillSecondary: '#fafafa',
  bg: '#ffffff',
  bgLayout: '#f5f5f5',
};

const statusConfig = {
  critical: { label: '緊急', color: colors.error, bg: colors.errorBg },
  warning: { label: '注意', color: colors.warning, bg: colors.warningBg },
  ok: { label: '充足', color: colors.success, bg: colors.successBg },
};

// ============================================
// 2. MOCK DATA
// ============================================
const mockInventory = [
  { id: 1, name: '全脂牛奶', category: '乳製品', quantity: 2, unit: '瓶', consumptionRate: 0.5, daysUntilEmpty: 4, expiryDate: '2026-02-12', location: '冰箱', lastUpdated: '2026-02-03', status: 'warning' },
  { id: 2, name: '雞蛋', category: '蛋類', quantity: 18, unit: '顆', consumptionRate: 3, daysUntilEmpty: 6, expiryDate: '2026-02-20', location: '冰箱', lastUpdated: '2026-02-04', status: 'ok' },
  { id: 3, name: '白米', category: '穀物', quantity: 2.5, unit: 'kg', consumptionRate: 0.3, daysUntilEmpty: 8, expiryDate: '2026-08-15', location: '儲藏室', lastUpdated: '2026-02-01', status: 'ok' },
  { id: 4, name: '洗碗精', category: '清潔用品', quantity: 0.2, unit: '瓶', consumptionRate: 0.05, daysUntilEmpty: 4, expiryDate: null, location: '廚房', lastUpdated: '2026-02-02', status: 'critical' },
  { id: 5, name: '衛生紙', category: '日用品', quantity: 3, unit: '包', consumptionRate: 0.5, daysUntilEmpty: 6, expiryDate: null, location: '浴室', lastUpdated: '2026-02-04', status: 'warning' },
  { id: 6, name: '義大利麵', category: '穀物', quantity: 4, unit: '包', consumptionRate: 0.3, daysUntilEmpty: 13, expiryDate: '2027-01-10', location: '儲藏室', lastUpdated: '2026-01-28', status: 'ok' },
  { id: 7, name: '橄欖油', category: '調味料', quantity: 0.8, unit: '瓶', consumptionRate: 0.02, daysUntilEmpty: 40, expiryDate: '2026-12-01', location: '廚房', lastUpdated: '2026-02-01', status: 'ok' },
  { id: 8, name: '洗衣精', category: '清潔用品', quantity: 0.3, unit: '瓶', consumptionRate: 0.1, daysUntilEmpty: 3, expiryDate: null, location: '陽台', lastUpdated: '2026-02-03', status: 'critical' },
];

const mockCategories = ['全部', '乳製品', '蛋類', '穀物', '清潔用品', '日用品', '調味料'];
const mockLocations = ['全部', '冰箱', '冷凍庫', '儲藏室', '廚房', '浴室', '陽台'];
const mockReminders = [
  { id: 1, type: 'purchase', item: '洗衣精', message: '庫存即將用完，建議 3 天內購買', priority: 'high', time: '今天' },
  { id: 2, type: 'purchase', item: '洗碗精', message: '庫存即將用完，建議 4 天內購買', priority: 'high', time: '今天' },
  { id: 3, type: 'expiry', item: '全脂牛奶', message: '將於 7 天後過期', priority: 'medium', time: '2026-02-12' },
];
const mockBudgetCategories = [
  { name: '食品', spent: 8500, budget: 10000, color: colors.primary },
  { name: '日用品', spent: 2200, budget: 3000, color: colors.success },
  { name: '清潔用品', spent: 850, budget: 1500, color: colors.warning },
  { name: '其他', spent: 900, budget: 2000, color: colors.textTertiary },
];

// ============================================
// 3. ANT DESIGN STYLED COMPONENTS
// ============================================

// Button Component (Ant Design Style)
const Button = ({ type = 'default', icon, children, onClick, size = 'middle', block, danger, style }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: size === 'small' ? '0 8px' : size === 'large' ? '8px 16px' : '4px 16px',
    height: size === 'small' ? 24 : size === 'large' ? 40 : 32,
    fontSize: size === 'small' ? 12 : 14,
    borderRadius: 6,
    border: '1px solid',
    cursor: 'pointer',
    fontWeight: 400,
    transition: 'all 0.2s',
    ...style,
  };
  
  const variants = {
    primary: { backgroundColor: danger ? colors.error : colors.primary, borderColor: danger ? colors.error : colors.primary, color: '#fff' },
    default: { backgroundColor: '#fff', borderColor: colors.border, color: colors.text },
    text: { backgroundColor: 'transparent', border: 'none', color: colors.primary },
    link: { backgroundColor: 'transparent', border: 'none', color: colors.primary, padding: 0, height: 'auto' },
  };

  return (
    <button style={{ ...baseStyle, ...variants[type], width: block ? '100%' : 'auto' }} onClick={onClick}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ title, extra, children, style, bodyStyle, size = 'default' }) => (
  <div style={{
    backgroundColor: colors.bg,
    borderRadius: 8,
    border: `1px solid ${colors.borderSecondary}`,
    ...style,
  }}>
    {title && (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: size === 'small' ? '8px 12px' : '12px 24px',
        borderBottom: `1px solid ${colors.borderSecondary}`,
      }}>
        <span style={{ fontWeight: 500, fontSize: 16 }}>{title}</span>
        {extra}
      </div>
    )}
    <div style={{ padding: size === 'small' ? 12 : 24, ...bodyStyle }}>{children}</div>
  </div>
);

// Tag Component
const Tag = ({ color, children }) => {
  const colorMap = {
    red: { bg: colors.errorBg, border: '#ffccc7', text: colors.error },
    orange: { bg: colors.warningBg, border: '#ffe58f', text: '#d46b08' },
    green: { bg: colors.successBg, border: '#b7eb8f', text: '#389e0d' },
    blue: { bg: colors.primaryBg, border: '#91caff', text: colors.primary },
    default: { bg: colors.fill, border: colors.border, text: colors.text },
  };
  const c = colorMap[color] || colorMap.default;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0 8px',
      fontSize: 12,
      lineHeight: '20px',
      borderRadius: 4,
      backgroundColor: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
    }}>
      {children}
    </span>
  );
};

// Badge Component
const Badge = ({ count, status, text }) => {
  if (status) {
    const statusColors = { success: colors.success, warning: colors.warning, error: colors.error, processing: colors.primary };
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColors[status] }} />
        {text && <span style={{ color: colors.text }}>{text}</span>}
      </span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1,
      backgroundColor: colors.error,
      color: '#fff',
      borderRadius: 10,
    }}>
      {count}
    </span>
  );
};

// Statistic Component
const Statistic = ({ title, value, prefix, suffix, valueStyle }) => (
  <div>
    <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: colors.text, ...valueStyle }}>
      {prefix && <span style={{ marginRight: 4 }}>{prefix}</span>}
      {value}
      {suffix && <span style={{ fontSize: 16, marginLeft: 4 }}>{suffix}</span>}
    </div>
  </div>
);

// Progress Component
const Progress = ({ percent, status, showInfo = true, size = 'default' }) => {
  const statusColors = { success: colors.success, exception: colors.error, active: colors.primary, normal: colors.primary };
  const color = statusColors[status] || statusColors.normal;
  const height = size === 'small' ? 6 : 8;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height, backgroundColor: colors.fill, borderRadius: height / 2 }}>
        <div style={{ width: `${Math.min(100, percent)}%`, height: '100%', backgroundColor: color, borderRadius: height / 2, transition: 'width 0.3s' }} />
      </div>
      {showInfo && <span style={{ fontSize: 14, color: colors.textSecondary, minWidth: 40 }}>{percent}%</span>}
    </div>
  );
};

// Input Component
const Input = ({ placeholder, value, onChange, prefix, suffix, style }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    height: 32,
    padding: '4px 11px',
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    transition: 'border-color 0.2s',
    ...style,
  }}>
    {prefix && <span style={{ marginRight: 8, color: colors.textTertiary }}>{prefix}</span>}
    <input
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: colors.text, backgroundColor: 'transparent' }}
    />
    {suffix && <span style={{ marginLeft: 8, color: colors.textTertiary }}>{suffix}</span>}
  </div>
);

// Select Component
const Select = ({ value, onChange, options, placeholder, style }) => (
  <select
    value={value}
    onChange={e => onChange?.(e.target.value)}
    style={{
      height: 32,
      padding: '4px 11px',
      paddingRight: 30,
      backgroundColor: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 6,
      fontSize: 14,
      color: colors.text,
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 11px center',
      ...style,
    }}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options?.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// Switch Component
const Switch = ({ checked, onChange }) => (
  <button
    onClick={() => onChange?.(!checked)}
    style={{
      width: 44,
      height: 22,
      padding: 0,
      borderRadius: 11,
      border: 'none',
      backgroundColor: checked ? colors.primary : 'rgba(0,0,0,0.25)',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background-color 0.2s',
    }}
  >
    <span style={{
      position: 'absolute',
      top: 2,
      left: checked ? 24 : 2,
      width: 18,
      height: 18,
      borderRadius: '50%',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'left 0.2s',
    }} />
  </button>
);

// Menu Component
const Menu = ({ items, selectedKey, onSelect, collapsed }) => (
  <ul style={{ listStyle: 'none', padding: '8px 0', margin: 0 }}>
    {items.map(item => (
      <li key={item.key}>
        <button
          onClick={() => onSelect?.(item.key)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: collapsed ? '12px 24px' : '10px 24px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            border: 'none',
            backgroundColor: selectedKey === item.key ? colors.primaryBg : 'transparent',
            color: selectedKey === item.key ? colors.primary : 'rgba(255,255,255,0.85)',
            fontSize: 14,
            cursor: 'pointer',
            borderRight: selectedKey === item.key ? `3px solid ${colors.primary}` : '3px solid transparent',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </button>
      </li>
    ))}
  </ul>
);

// Table Component
const Table = ({ columns, dataSource, onRow, size = 'middle' }) => {
  const padding = size === 'small' ? '8px 8px' : size === 'large' ? '16px 16px' : '12px 16px';
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: colors.fillSecondary }}>
          {columns.map(col => (
            <th key={col.key || col.dataIndex} style={{
              padding,
              textAlign: col.align || 'left',
              fontSize: 14,
              fontWeight: 500,
              color: colors.text,
              borderBottom: `1px solid ${colors.borderSecondary}`,
            }}>
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((record, index) => (
          <tr
            key={record.key || record.id || index}
            onClick={() => onRow?.(record).onClick?.()}
            style={{ cursor: onRow ? 'pointer' : 'default', transition: 'background-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.fillSecondary}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {columns.map(col => (
              <td key={col.key || col.dataIndex} style={{
                padding,
                fontSize: 14,
                color: colors.text,
                borderBottom: `1px solid ${colors.borderSecondary}`,
                textAlign: col.align || 'left',
              }}>
                {col.render ? col.render(record[col.dataIndex], record, index) : record[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Modal Component
const Modal = ({ open, title, onCancel, children, footer, width = 520 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onCancel}>
      <div style={{
        width,
        maxWidth: '90vw',
        maxHeight: '90vh',
        backgroundColor: colors.bg,
        borderRadius: 8,
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: `1px solid ${colors.borderSecondary}`,
        }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
          <button onClick={onCancel} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: colors.textTertiary }}>✕</button>
        </div>
        <div style={{ padding: 24, maxHeight: 'calc(90vh - 140px)', overflowY: 'auto' }}>{children}</div>
        {footer !== null && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 16px', borderTop: `1px solid ${colors.borderSecondary}`, backgroundColor: colors.fillSecondary }}>
            {footer || (
              <>
                <Button onClick={onCancel}>取消</Button>
                <Button type="primary" onClick={onCancel}>確定</Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Steps Component
const Steps = ({ current, items }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 500,
            backgroundColor: index <= current ? colors.primary : colors.fill,
            color: index <= current ? '#fff' : colors.textTertiary,
            border: index <= current ? 'none' : `1px solid ${colors.border}`,
          }}>
            {index < current ? '✓' : index + 1}
          </div>
          <span style={{ fontSize: 14, color: index <= current ? colors.text : colors.textTertiary }}>{item.title}</span>
        </div>
        {index < items.length - 1 && (
          <div style={{ width: 40, height: 1, backgroundColor: index < current ? colors.primary : colors.border, margin: '0 8px' }} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// Alert Component
const Alert = ({ type = 'info', message, description, showIcon = true }) => {
  const typeConfig = {
    info: { bg: colors.primaryBg, border: '#91caff', icon: 'ℹ️', color: colors.primary },
    success: { bg: colors.successBg, border: '#b7eb8f', icon: '✓', color: colors.success },
    warning: { bg: colors.warningBg, border: '#ffe58f', icon: '⚠️', color: colors.warning },
    error: { bg: colors.errorBg, border: '#ffccc7', icon: '✕', color: colors.error },
  };
  const config = typeConfig[type];
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '12px 16px',
      backgroundColor: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 8,
    }}>
      {showIcon && <span style={{ color: config.color }}>{config.icon}</span>}
      <div>
        <div style={{ fontWeight: 500, color: colors.text }}>{message}</div>
        {description && <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>{description}</div>}
      </div>
    </div>
  );
};

// ============================================
// 4. SIDEBAR COMPONENT
// ============================================
function Sidebar({ currentView, onNavigate, collapsed, onCollapse }) {
  const menuItems = [
    { key: 'dashboard', icon: '📊', label: '總覽' },
    { key: 'inventory', icon: '📦', label: '庫存清單' },
    { key: 'reminders', icon: '🔔', label: '提醒事項' },
    { key: 'budget', icon: '💰', label: '預算追蹤' },
    { key: 'settings', icon: '⚙️', label: '設定' },
  ];

  return (
    <aside style={{
      width: collapsed ? 80 : 200,
      minHeight: '100vh',
      backgroundColor: '#001529',
      transition: 'width 0.2s',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ fontSize: 24 }}>🏠</span>
        {!collapsed && <span style={{ color: '#fff', fontSize: 16, fontWeight: 500, marginLeft: 12 }}>AI 管家</span>}
      </div>

      {/* Menu */}
      <Menu items={menuItems} selectedKey={currentView} onSelect={onNavigate} collapsed={collapsed} />

      {/* Collapse Button */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => onCollapse(!collapsed)}
          style={{
            width: '100%',
            padding: 16,
            border: 'none',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.65)',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {collapsed ? '▶' : '◀ 收合選單'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>A</div>
          <div>
            <div style={{ color: '#fff', fontSize: 13 }}>Anthony's Home</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>管理員</div>
          </div>
        </div>
      )}
    </aside>
  );
}

// ============================================
// 5. HEADER COMPONENT
// ============================================
function Header({ title }) {
  return (
    <header style={{
      height: 64,
      backgroundColor: colors.bg,
      borderBottom: `1px solid ${colors.borderSecondary}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button type="text" icon="🔔" />
        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>A</div>
      </div>
    </header>
  );
}

// ============================================
// 6. DASHBOARD PAGE
// ============================================
function Dashboard({ onNavigate, onSelectItem, onAddNew }) {
  const critical = mockInventory.filter(i => i.status === 'critical');
  const warning = mockInventory.filter(i => i.status === 'warning');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>總覽</h2>
          <p style={{ margin: '4px 0 0', color: colors.textSecondary }}>2026年2月5日 星期四</p>
        </div>
        <Button type="primary" icon="+" onClick={onAddNew}>新增物品</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { title: '總物品數', value: mockInventory.length, icon: '📦', color: colors.primary },
          { title: '緊急補貨', value: critical.length, icon: '🚨', color: colors.error },
          { title: '即將用完', value: warning.length, icon: '⚠️', color: colors.warning },
          { title: '本月支出', value: 'NT$12,450', icon: '💰', color: colors.success },
        ].map((stat, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{stat.icon}</div>
              <Statistic title={stat.title} value={stat.value} valueStyle={{ color: stat.color }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Critical */}
        <Card title="🚨 需要立即處理" extra={<Badge count={critical.length} />}>
          {critical.length === 0 ? (
            <div style={{ textAlign: 'center', color: colors.success, padding: 24 }}>✓ 目前沒有緊急事項</div>
          ) : (
            critical.map(item => (
              <div key={item.id} onClick={() => onSelectItem(item)} style={{ padding: 12, marginBottom: 8, backgroundColor: colors.fillSecondary, borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>剩餘 {item.quantity} {item.unit} · {item.daysUntilEmpty} 天後用完</div>
                  </div>
                  <Tag color="red">補貨</Tag>
                </div>
              </div>
            ))
          )}
        </Card>

        {/* Warning */}
        <Card title="⚠️ 庫存注意" extra={<Badge count={warning.length} />}>
          {warning.map(item => (
            <div key={item.id} onClick={() => onSelectItem(item)} style={{ padding: 12, marginBottom: 8, backgroundColor: colors.fillSecondary, borderRadius: 8, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>剩餘 {item.quantity} {item.unit} · {item.daysUntilEmpty} 天後用完</div>
                </div>
                <Tag color="orange">注意</Tag>
              </div>
            </div>
          ))}
        </Card>

        {/* Quick Actions */}
        <Card title="⚡ 快速操作">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: '📝', label: '記錄消耗' },
              { icon: '📸', label: '掃描條碼' },
              { icon: '🛒', label: '購物清單' },
              { icon: '🤖', label: 'AI 建議' },
            ].map((action, i) => (
              <Button key={i} block style={{ height: 64, flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 24 }}>{action.icon}</span>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Chart */}
        <Card title="📊 本週消耗趨勢" extra={<Select value="week" options={[{ value: 'week', label: '本週' }, { value: 'month', label: '本月' }]} style={{ width: 100 }} />} style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 160 }}>
            {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
              <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: `${30 + Math.random() * 80}px`, backgroundColor: i === 3 ? colors.primary : colors.fill, borderRadius: '4px 4px 0 0' }} />
                <span style={{ fontSize: 12, color: colors.textSecondary }}>{d}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// 7. INVENTORY PAGE
// ============================================
function Inventory({ onSelectItem, onAddNew }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [location, setLocation] = useState('全部');
  const [viewMode, setViewMode] = useState('table');

  const filtered = mockInventory.filter(item => {
    return item.name.includes(search) && (category === '全部' || item.category === category) && (location === '全部' || item.location === location);
  }).sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);

  const columns = [
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Badge status={status === 'critical' ? 'error' : status === 'warning' ? 'warning' : 'success'} />,
    },
    { title: '物品名稱', dataIndex: 'name', key: 'name', render: (text) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '分類', dataIndex: 'category', key: 'category', render: (text) => <Tag>{text}</Tag> },
    { title: '數量', dataIndex: 'quantity', key: 'quantity', render: (_, record) => `${record.quantity} ${record.unit}` },
    { title: '位置', dataIndex: 'location', key: 'location' },
    {
      title: '預計用完',
      dataIndex: 'daysUntilEmpty',
      key: 'daysUntilEmpty',
      render: (days) => (
        <span style={{ color: days <= 3 ? colors.error : days <= 7 ? colors.warning : colors.textSecondary }}>
          {days} 天
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div onClick={e => e.stopPropagation()}>
          <Button type="link" size="small">消耗</Button>
          <Button type="link" size="small">補貨</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>庫存清單</h2>
          <p style={{ margin: '4px 0 0', color: colors.textSecondary }}>共 {mockInventory.length} 項物品</p>
        </div>
        <Button type="primary" icon="+" onClick={onAddNew}>新增物品</Button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input placeholder="搜尋物品..." value={search} onChange={setSearch} prefix="🔍" style={{ width: 240 }} />
        <Select value={category} onChange={setCategory} options={mockCategories.map(c => ({ value: c, label: c }))} style={{ width: 120 }} />
        <Select value={location} onChange={setLocation} options={mockLocations.map(l => ({ value: l, label: l }))} style={{ width: 120 }} />
        <div style={{ marginLeft: 'auto', display: 'flex', border: `1px solid ${colors.border}`, borderRadius: 6 }}>
          <button onClick={() => setViewMode('table')} style={{ padding: '6px 12px', border: 'none', backgroundColor: viewMode === 'table' ? colors.fill : 'transparent', cursor: 'pointer', borderRadius: '6px 0 0 6px' }}>☰</button>
          <button onClick={() => setViewMode('grid')} style={{ padding: '6px 12px', border: 'none', backgroundColor: viewMode === 'grid' ? colors.fill : 'transparent', cursor: 'pointer', borderRadius: '0 6px 6px 0' }}>⊞</button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card bodyStyle={{ padding: 0 }}>
          <Table columns={columns} dataSource={filtered} onRow={(record) => ({ onClick: () => onSelectItem(record) })} />
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(item => (
            <Card key={item.id} style={{ cursor: 'pointer' }} onClick={() => onSelectItem(item)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: colors.textSecondary }}>{item.category}</span>
                <Tag color={item.status === 'critical' ? 'red' : item.status === 'warning' ? 'orange' : 'green'}>
                  {statusConfig[item.status].label}
                </Tag>
              </div>
              <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 500 }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 600 }}>{item.quantity}</span>
                <span style={{ color: colors.textSecondary }}>{item.unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>
                <span>📍 {item.location}</span>
                <span>⏱ {item.daysUntilEmpty} 天</span>
              </div>
              <Progress percent={Math.min(100, (item.daysUntilEmpty / 14) * 100)} status={item.status === 'critical' ? 'exception' : item.status === 'warning' ? 'active' : 'success'} showInfo={false} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// 8. ITEM DETAIL PAGE
// ============================================
function ItemDetail({ item, onBack }) {
  const [qty, setQty] = useState(item.quantity);
  const history = [
    { date: '2026-02-04', amount: 0.5, note: '早餐使用' },
    { date: '2026-02-03', amount: 0.5, note: '' },
    { date: '2026-02-02', amount: 1, note: '做蛋糕' },
    { date: '2026-02-01', amount: 0.5, note: '' },
  ];

  return (
    <div>
      <Button type="link" onClick={onBack} style={{ padding: 0, marginBottom: 16 }}>← 返回列表</Button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Main Info */}
        <Card style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <Tag>{item.category}</Tag>
              <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>{item.name}</h2>
            </div>
            <Tag color={item.status === 'critical' ? 'red' : item.status === 'warning' ? 'orange' : 'green'} style={{ fontSize: 14, padding: '4px 12px' }}>
              {statusConfig[item.status].label}
            </Tag>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 24, padding: '24px 0', borderTop: `1px solid ${colors.borderSecondary}`, borderBottom: `1px solid ${colors.borderSecondary}` }}>
            {[
              { label: '目前數量', value: `${qty} ${item.unit}` },
              { label: '存放位置', value: item.location },
              { label: '日均消耗', value: `${item.consumptionRate} ${item.unit}/天` },
              { label: '預計用完', value: `${item.daysUntilEmpty} 天後` },
              { label: '有效期限', value: item.expiryDate || '-' },
              { label: '最後更新', value: item.lastUpdated },
            ].map((info, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>{info.label}</div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{info.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button onClick={() => setQty(Math.max(0, qty - 0.5))}>−</Button>
            <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} style={{ width: 80, height: 32, textAlign: 'center', border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 16 }} />
            <span style={{ color: colors.textSecondary }}>{item.unit}</span>
            <Button onClick={() => setQty(qty + 0.5)}>+</Button>
            <Button type="primary">更新數量</Button>
          </div>
        </Card>

        {/* History */}
        <Card title="📜 消耗紀錄">
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < history.length - 1 ? `1px solid ${colors.borderSecondary}` : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{h.date}</div>
                {h.note && <div style={{ fontSize: 12, color: colors.textSecondary }}>{h.note}</div>}
              </div>
              <span style={{ color: colors.error, fontWeight: 500 }}>-{h.amount} {item.unit}</span>
            </div>
          ))}
          <Button type="link" style={{ marginTop: 12, padding: 0 }}>查看完整紀錄 →</Button>
        </Card>

        {/* AI */}
        <Card title="🤖 AI 建議">
          <Alert
            type="info"
            message={<span>根據您過去 30 天的消耗模式，建議在 <strong>2 天內</strong> 購買 {item.name}。</span>}
            description={`預估需要購買 2 ${item.unit}，可維持約 2 週使用量。`}
          />
          <Button style={{ marginTop: 16 }}>加入購物清單</Button>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// 9. REMINDERS PAGE
// ============================================
function Reminders() {
  const [filter, setFilter] = useState('all');
  const filters = [
    { key: 'all', label: '全部' },
    { key: 'purchase', label: '🛒 補貨' },
    { key: 'expiry', label: '⏰ 過期' },
  ];
  const filtered = filter === 'all' ? mockReminders : mockReminders.filter(r => r.type === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>提醒事項</h2>
          <p style={{ margin: '4px 0 0', color: colors.textSecondary }}>管理您的購買與過期提醒</p>
        </div>
        <Button type="primary" icon="+">新增提醒</Button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {filters.map(f => (
          <Button key={f.key} type={filter === f.key ? 'primary' : 'default'} onClick={() => setFilter(f.key)}>{f.label}</Button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(r => (
          <Card key={r.id}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: colors.fill, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {r.type === 'purchase' ? '🛒' : '⏰'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{r.item}</span>
                  <Tag color={r.priority === 'high' ? 'red' : 'orange'}>{r.priority === 'high' ? '緊急' : '一般'}</Tag>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary }}>{r.message}</p>
                <span style={{ fontSize: 12, color: colors.textTertiary }}>{r.time}</span>
              </div>
              <Button size="small">完成</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 10. BUDGET PAGE
// ============================================
function Budget() {
  const total = mockBudgetCategories.reduce((s, c) => ({ spent: s.spent + c.spent, budget: s.budget + c.budget }), { spent: 0, budget: 0 });
  const pct = Math.round((total.spent / total.budget) * 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>預算追蹤</h2>
          <p style={{ margin: '4px 0 0', color: colors.textSecondary }}>2026 年 2 月</p>
        </div>
        <Select value="2026-02" options={[{ value: '2026-02', label: '2026 年 2 月' }, { value: '2026-01', label: '2026 年 1 月' }]} style={{ width: 150 }} />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Statistic title="本月支出" value={`NT$ ${total.spent.toLocaleString()}`} suffix={`/ NT$ ${total.budget.toLocaleString()}`} valueStyle={{ fontSize: 32 }} />
          <div style={{ width: 300 }}>
            <Progress percent={pct} status={pct > 90 ? 'exception' : 'active'} />
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {mockBudgetCategories.map(c => (
          <Card key={c.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{c.name}</span>
              <span style={{ color: colors.textSecondary }}>NT$ {c.spent.toLocaleString()} / {c.budget.toLocaleString()}</span>
            </div>
            <Progress percent={Math.round((c.spent / c.budget) * 100)} showInfo={false} />
            <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 8 }}>{Math.round((c.spent / c.budget) * 100)}%</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 11. SETTINGS PAGE
// ============================================
function Settings() {
  const [notif, setNotif] = useState({ purchase: true, expiry: true, daily: false });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 500 }}>設定</h2>
        <p style={{ margin: '4px 0 0', color: colors.textSecondary }}>自訂您的 AI Housekeeper</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card title="帳號設定">
          {[{ label: '家庭名稱', value: "Anthony's Home" }, { label: '成員管理', value: '2 位成員' }].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? `1px solid ${colors.borderSecondary}` : 'none' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>{s.value}</div>
              </div>
              <Button type="link">編輯</Button>
            </div>
          ))}
        </Card>

        <Card title="通知設定">
          {[
            { key: 'purchase', label: '補貨提醒', desc: '庫存低於設定值時通知' },
            { key: 'expiry', label: '過期提醒', desc: '物品即將過期時通知' },
            { key: 'daily', label: '每日摘要', desc: '每天早上發送庫存摘要' },
          ].map((s, i) => (
            <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? `1px solid ${colors.borderSecondary}` : 'none' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>{s.desc}</div>
              </div>
              <Switch checked={notif[s.key]} onChange={v => setNotif({ ...notif, [s.key]: v })} />
            </div>
          ))}
        </Card>

        <Card title="資料管理">
          {[
            { label: '匯出資料', desc: '匯出所有庫存與紀錄（CSV/JSON）' },
            { label: '匯入資料', desc: '從檔案匯入庫存資料' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? `1px solid ${colors.borderSecondary}` : 'none' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>{s.desc}</div>
              </div>
              <Button>{s.label.slice(0, 2)}</Button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ============================================
// 12. ADD ITEM MODAL
// ============================================
function AddItemModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unit: '個', location: '', expiryDate: '', rate: '' });
  const steps = [{ title: '基本資訊' }, { title: '數量單位' }, { title: '消耗設定' }];

  const handleClose = () => {
    setStep(0);
    setForm({ name: '', category: '', quantity: '', unit: '個', location: '', expiryDate: '', rate: '' });
    onClose();
  };

  return (
    <Modal open={open} title="新增物品" onCancel={handleClose} footer={
      <div style={{ display: 'flex', gap: 8 }}>
        {step > 0 && <Button onClick={() => setStep(step - 1)}>上一步</Button>}
        <div style={{ flex: 1 }} />
        <Button onClick={handleClose}>取消</Button>
        <Button type="primary" onClick={() => step < 2 ? setStep(step + 1) : handleClose()}>{step < 2 ? '下一步' : '完成新增'}</Button>
      </div>
    }>
      <Steps current={step} items={steps} />
      <div style={{ marginTop: 24 }}>
        {step === 0 && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>物品名稱 *</label>
              <Input placeholder="例：全脂牛奶" value={form.name} onChange={v => setForm({ ...form, name: v })} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>分類 *</label>
                <Select value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="選擇分類" options={mockCategories.filter(c => c !== '全部').map(c => ({ value: c, label: c }))} style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>存放位置 *</label>
                <Select value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="選擇位置" options={mockLocations.filter(l => l !== '全部').map(l => ({ value: l, label: l }))} style={{ width: '100%' }} />
              </div>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>數量 *</label>
                <Input type="number" placeholder="0" value={form.quantity} onChange={v => setForm({ ...form, quantity: v })} style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>單位 *</label>
                <Select value={form.unit} onChange={v => setForm({ ...form, unit: v })} options={['個', '瓶', '包', '盒', 'kg', 'g', 'L', 'ml'].map(u => ({ value: u, label: u }))} style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>有效期限（選填）</label>
              <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} style={{ width: '100%', height: 32, padding: '4px 11px', border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 14 }} />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>預估每日消耗量</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Input type="number" placeholder="0" value={form.rate} onChange={v => setForm({ ...form, rate: v })} style={{ flex: 1 }} />
                <span style={{ color: colors.textSecondary }}>{form.unit} / 天</span>
              </div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>系統會根據實際使用紀錄自動調整</div>
            </div>
            <Card size="small" style={{ backgroundColor: colors.fillSecondary }}>
              <div style={{ fontWeight: 500, marginBottom: 12 }}>確認資訊</div>
              {[['物品名稱', form.name || '-'], ['分類', form.category || '-'], ['數量', `${form.quantity || '0'} ${form.unit}`], ['位置', form.location || '-']].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.borderSecondary}` }}>
                  <span style={{ color: colors.textSecondary }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
    </Modal>
  );
}

// ============================================
// 13. MAIN APP
// ============================================
export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const viewTitles = { dashboard: '總覽', inventory: '庫存清單', detail: '物品詳情', reminders: '提醒事項', budget: '預算追蹤', settings: '設定' };

  const handleSelectItem = (item) => { setSelectedItem(item); setView('detail'); };
  const handleBack = () => { setView('inventory'); setSelectedItem(null); };

  const renderContent = () => {
    switch (view) {
      case 'dashboard': return <Dashboard onNavigate={setView} onSelectItem={handleSelectItem} onAddNew={() => setShowModal(true)} />;
      case 'inventory': return <Inventory onSelectItem={handleSelectItem} onAddNew={() => setShowModal(true)} />;
      case 'detail': return selectedItem ? <ItemDetail item={selectedItem} onBack={handleBack} /> : null;
      case 'reminders': return <Reminders />;
      case 'budget': return <Budget />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setView} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bgLayout, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' }}>
      <Sidebar currentView={view} onNavigate={setView} collapsed={collapsed} onCollapse={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header title={viewTitles[view]} />
        <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>{renderContent()}</main>
      </div>
      <AddItemModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
