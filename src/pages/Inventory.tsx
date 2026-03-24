// ============================================
// Inventory.tsx - 庫存清單頁面
// ============================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Spin,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import type { InventoryItem, ViewMode, AddItemFormData, ApiCategory, ApiProduct, SelectOption } from '@/types';
import { mockLocations } from '@/mockData';
import { useNavigate } from 'react-router-dom';
import { statusConfig } from '@/theme';
import AddItemModal from '@components/component/AddItemModal';
import CategoryModal from '@components/component/CategoryModal';
import { inventoryApi, productApi, categoryApi } from '@api/inventory';
import { mapApiInventoryToItem } from '@/utils/inventoryMapper';

const { Title, Text } = Typography;

/**
 * Inventory 元件
 */
const Inventory: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('全部');
  const [location, setLocation] = useState<string>('全部');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  /**
   * 從 API 載入資料
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [inventories, categories, products] = await Promise.all([
        inventoryApi.getAll(),
        categoryApi.getAll(),
        productApi.getAll(),
      ]);
      setInventoryItems(inventories.map(mapApiInventoryToItem));
      setApiCategories(categories);
      setApiProducts(products);
    } catch (err) {
      console.error('Failed to fetch inventory data:', err);
      setError('無法載入庫存資料');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 動態建立分類篩選選項
   */
  const categoryOptions = useMemo((): SelectOption[] => {
    return [
      { value: '全部', label: '全部' },
      ...apiCategories.map(c => ({ value: c.name, label: c.name })),
    ];
  }, [apiCategories]);

  /**
   * 動態建立位置篩選選項
   */
  const locationOptions = useMemo((): SelectOption[] => {
    const uniqueLocations = [...new Set(inventoryItems.map(i => i.location).filter(Boolean))];
    return [
      { value: '全部', label: '全部' },
      ...uniqueLocations.map(loc => ({ value: loc, label: loc })),
    ];
  }, [inventoryItems]);

  /**
   * 篩選後的資料
   */
  const filteredData = useMemo((): InventoryItem[] => {
    return inventoryItems
      .filter(item => {
        const matchSearch = item.name.includes(search);
        const matchCategory = category === '全部' || item.category === category;
        const matchLocation = location === '全部' || item.location === location;
        return matchSearch && matchCategory && matchLocation;
      })
      .sort((a, b) => a.daysUntilEmpty - b.daysUntilEmpty);
  }, [inventoryItems, search, category, location]);

  /**
   * 表格欄位定義
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
              e.stopPropagation();
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const handleViewModeChange = (value: string | number): void => {
    setViewMode(value as ViewMode);
  };

  const handleSelectItem = (item: InventoryItem) => {
    navigate(`/inventory/${item.id}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  /**
   * 提交新增庫存：從現有商品中選取後，僅建立 Inventory
   */
  const handleSubmit = async (values: AddItemFormData) => {
    try {
      await inventoryApi.create({
        productId: values.productId,
        location: values.location || null,
        initialQuantity: values.quantity ?? 1,
        nearestExpiryDate: values.expiryDate,
      });

      message.success('物品新增成功');
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to create inventory:', err);
      message.error('新增物品失敗，請稍後再試');
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        {/* 頁面標題 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>庫存清單</Title>
            <Text type="secondary">共 {inventoryItems.length} 項物品</Text>
          </div>
          <Space>
            <Button onClick={() => setIsCategoryModalOpen(true)}>
              分類管理
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              新增物品
            </Button>
          </Space>
        </div>

        {error && (
          <Card style={{ marginBottom: 16 }}>
            <Text type="danger">{error}</Text>
          </Card>
        )}

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
            options={categoryOptions}
            style={{ width: 120 }}
          />
          <Select
            value={location}
            onChange={setLocation}
            options={locationOptions}
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

        {/* 新增物品 Modal */}
        <AddItemModal
          open={isModalOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          products={apiProducts}
          categories={apiCategories}
        />

        {/* 分類管理 Modal */}
        <CategoryModal
          open={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={apiCategories}
          onCategoriesChange={setApiCategories}
        />
      </div>
    </Spin>
  );
};

export default Inventory;
