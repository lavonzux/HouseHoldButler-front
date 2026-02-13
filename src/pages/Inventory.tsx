// ============================================
// Inventory.tsx - 庫存清單頁面
// ============================================
// 
// TypeScript 學習重點：
// 1. Ant Design Table 的 ColumnsType 泛型
// 2. 事件處理的型別 (React.MouseEvent)
// 3. useState 的泛型用法
// 4. 條件渲染時的型別縮小 (Type Narrowing)
// ============================================

import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Badge, 
  Progress,
  Space,
  Row,
  Col,
  Segmented,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  PlusOutlined, 
  SearchOutlined, 
  AppstoreOutlined, 
  BarsOutlined,
} from '@ant-design/icons';
import type { InventoryProps, InventoryItem, ViewMode } from '../types';
import { mockInventory, mockCategories, mockLocations } from '../mockData';
import { useNavigate } from 'react-router-dom';
import { statusConfig } from '../theme';

const { Title, Text } = Typography;

/**
 * Inventory 元件
 */
const Inventory: React.FC = () => {
  // 使用泛型明確指定 state 的型別
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('全部');
  const [location, setLocation] = useState<string>('全部');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const navigate = useNavigate();

  /**
   * 篩選後的資料
   * useMemo 的泛型會根據回傳值自動推斷
   */
  const filteredData = useMemo((): InventoryItem[] => {
    return mockInventory
      .filter(item => {
        const matchSearch = item.name.includes(search);
        const matchCategory = category === '全部' || item.category === category;
        const matchLocation = location === '全部' || item.location === location;
        return matchSearch && matchCategory && matchLocation;
      })
      .sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);
  }, [search, category, location]);

  /**
   * 表格欄位定義
   * 使用 ColumnsType<InventoryItem> 泛型確保型別安全
   */
  const columns: ColumnsType<InventoryItem> = [
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: InventoryItem['status']) => (
        <Badge status={statusConfig[status].badgeStatus} />
      ),
    },
    {
      title: '物品名稱',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '分類',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: '數量',
      key: 'quantity',
      render: (_: unknown, record: InventoryItem) => 
        `${record.quantity} ${record.unit}`,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '預計用完',
      dataIndex: 'daysUntilEmpty',
      key: 'daysUntilEmpty',
      render: (days: number) => (
        <Text type={days <= 3 ? 'danger' : days <= 7 ? 'warning' : 'secondary'}>
          {days} 天
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_: unknown, _record: InventoryItem) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // 阻止事件冒泡
            }}
          >
            消耗
          </Button>
          <Button 
            type="link" 
            size="small" 
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
            }}
          >
            補貨
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * 處理搜尋輸入變更
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  /**
   * 處理視圖模式變更
   */
  const handleViewModeChange = (value: string | number): void => {
    setViewMode(value as ViewMode);
  };
  
  // 點擊物品 → 跳轉詳情頁
  const handleSelectItem = (item: InventoryItem) => {
    navigate(`/inventory/${item.id}`);
  };

  // 新增物品按鈕
  const handleAddNew = () => {
    // 同 Dashboard，可選擇跳轉或之後用 Modal
    alert('新增物品功能尚未實作獨立頁面');
    // 或：navigate('/add-item');
  };

  return (
    <div>
      {/* 頁面標題 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>庫存清單</Title>
          <Text type="secondary">共 {mockInventory.length} 項物品</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          新增物品
        </Button>
      </div>

      {/* 工具列 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜尋物品..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={handleSearchChange}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          value={category}
          onChange={setCategory}
          options={mockCategories}
          style={{ width: 120 }}
        />
        <Select
          value={location}
          onChange={setLocation}
          options={mockLocations}
          style={{ width: 120 }}
        />
        <Segmented
          value={viewMode}
          onChange={handleViewModeChange}
          options={[
            { value: 'table', icon: <BarsOutlined /> },
            { value: 'grid', icon: <AppstoreOutlined /> },
          ]}
        />
      </Space>

      {/* 表格視圖 */}
      {viewMode === 'table' && (
        <Card bodyStyle={{ padding: 0 }}>
          <Table<InventoryItem>
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => handleSelectItem(record),
              style: { cursor: 'pointer' },
            })}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      {/* 卡片視圖 */}
      {viewMode === 'grid' && (
        <Row gutter={[16, 16]}>
          {filteredData.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card 
                hoverable 
                onClick={() => handleSelectItem(item)}
                style={{ height: '100%' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.category}</Text>
                  <Tag color={statusConfig[item.status].tagColor}>
                    {statusConfig[item.status].label}
                  </Tag>
                </div>
                <Title level={4} style={{ margin: '0 0 12px' }}>{item.name}</Title>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                  <span style={{ fontSize: 32, fontWeight: 600 }}>{item.quantity}</span>
                  <Text type="secondary">{item.unit}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text type="secondary">📍 {item.location}</Text>
                  <Text type="secondary">⏱ {item.daysUntilEmpty} 天</Text>
                </div>
                <Progress 
                  percent={Math.min(100, (item.daysUntilEmpty / 14) * 100)} 
                  status={
                    item.status === 'critical' 
                      ? 'exception' 
                      : item.status === 'warning' 
                        ? 'active' 
                        : 'success'
                  } 
                  showInfo={false} 
                  size="small" 
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Inventory;
