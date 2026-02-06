// ============================================
// Inventory.jsx - 庫存清單頁面
// ============================================

import React, { useState, useMemo } from 'react';
import { 
  Table, Card, Input, Select, Button, Tag, Badge, Progress,
  Space, Row, Col, Segmented, Typography,
} from 'antd';
import { PlusOutlined, SearchOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { mockInventory, mockCategories, mockLocations } from './mockData';
import { statusConfig } from './theme';

const { Title, Text } = Typography;

export default function Inventory({ onSelectItem, onAddNew }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [location, setLocation] = useState('全部');
  const [viewMode, setViewMode] = useState('table');

  const filteredData = useMemo(() => {
    return mockInventory
      .filter(item => {
        const matchSearch = item.name.includes(search);
        const matchCategory = category === '全部' || item.category === category;
        const matchLocation = location === '全部' || item.location === location;
        return matchSearch && matchCategory && matchLocation;
      })
      .sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);
  }, [search, category, location]);

  const columns = [
    { title: '狀態', dataIndex: 'status', key: 'status', width: 80,
      render: (status) => <Badge status={statusConfig[status].badgeStatus} /> },
    { title: '物品名稱', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
    { title: '分類', dataIndex: 'category', key: 'category', render: (text) => <Tag>{text}</Tag> },
    { title: '數量', key: 'quantity', render: (_, r) => `${r.quantity} ${r.unit}` },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '預計用完', dataIndex: 'daysUntilEmpty', key: 'daysUntilEmpty',
      render: (days) => <Text type={days <= 3 ? 'danger' : days <= 7 ? 'warning' : 'secondary'}>{days} 天</Text> },
    { title: '操作', key: 'action', align: 'center',
      render: () => (
        <Space size="small">
          <Button type="link" size="small" onClick={e => e.stopPropagation()}>消耗</Button>
          <Button type="link" size="small" onClick={e => e.stopPropagation()}>補貨</Button>
        </Space>
      ) },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>庫存清單</Title>
          <Text type="secondary">共 {mockInventory.length} 項物品</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>新增物品</Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input placeholder="搜尋物品..." prefix={<SearchOutlined />} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} allowClear />
        <Select value={category} onChange={setCategory} options={mockCategories} style={{ width: 120 }} />
        <Select value={location} onChange={setLocation} options={mockLocations} style={{ width: 120 }} />
        <Segmented value={viewMode} onChange={setViewMode} options={[{ value: 'table', icon: <BarsOutlined /> }, { value: 'grid', icon: <AppstoreOutlined /> }]} />
      </Space>

      {viewMode === 'table' && (
        <Card bodyStyle={{ padding: 0 }}>
          <Table columns={columns} dataSource={filteredData} rowKey="id" onRow={(record) => ({ onClick: () => onSelectItem(record), style: { cursor: 'pointer' } })} pagination={{ pageSize: 10 }} />
        </Card>
      )}

      {viewMode === 'grid' && (
        <Row gutter={[16, 16]}>
          {filteredData.map(item => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card hoverable onClick={() => onSelectItem(item)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.category}</Text>
                  <Tag color={statusConfig[item.status].tagColor}>{statusConfig[item.status].label}</Tag>
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
                <Progress percent={Math.min(100, (item.daysUntilEmpty / 14) * 100)} status={item.status === 'critical' ? 'exception' : item.status === 'warning' ? 'active' : 'success'} showInfo={false} size="small" />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
