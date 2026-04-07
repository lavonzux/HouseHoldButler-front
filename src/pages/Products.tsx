// ============================================
// Products.tsx - 商品管理頁面
// ============================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Typography,
  Spin,
  message,
  Modal,
  Form,
  InputNumber,
  Alert,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, WarningOutlined, HistoryOutlined } from '@ant-design/icons';
import type { ApiProduct, ApiInventory, ApiCategory, SelectOption, UpdateProductApiRequest } from '@/types';
import { productApi, categoryApi, inventoryApi } from '@api/inventory';
import ProductHistoryModal from '@/components/component/ProductHistoryModal';

const { Title, Text } = Typography;

type ProductFormValues = {
  name: string;
  categoryId?: string;
  unit?: string;
  barcode?: string;
  avgConsumptionRate: number;
  lowStockThreshold: number;
};

const Products: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('全部');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 新增 / 編輯 Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<ProductFormValues>();

  // 歷史紀錄 Modal state
  const [historyTarget, setHistoryTarget] = useState<ApiProduct | null>(null);

  // 刪除確認 Modal state
  const [deleteTarget, setDeleteTarget] = useState<ApiProduct | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCheckLoading, setDeleteCheckLoading] = useState(false);
  const [relatedInventories, setRelatedInventories] = useState<ApiInventory[]>([]);
  const [deleteConfirming, setDeleteConfirming] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, categoriesData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('無法載入商品資料');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categoryOptions = useMemo((): SelectOption[] => [
    { value: '全部', label: '全部' },
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ], [categories]);

  const filteredData = useMemo((): ApiProduct[] =>
    products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === '全部' || p.categoryId === categoryFilter;
      return matchSearch && matchCategory;
    }),
  [products, search, categoryFilter]);

  // ─── 新增 / 編輯 ───────────────────────────────────────

  const handleOpenAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({ avgConsumptionRate: 0, lowStockThreshold: 20 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ApiProduct) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      categoryId: product.categoryId ?? undefined,
      unit: product.unit ?? undefined,
      barcode: product.barcode ?? undefined,
      avgConsumptionRate: +(product.avgConsumptionRate * 100).toFixed(2),
      lowStockThreshold: +(product.lowStockThreshold * 100).toFixed(0),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: UpdateProductApiRequest = {
        name: values.name,
        categoryId: values.categoryId ?? null,
        barcode: values.barcode || null,
        unit: values.unit || null,
        avgConsumptionRate: values.avgConsumptionRate / 100,
        lowStockThreshold: values.lowStockThreshold / 100,
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, payload);
        message.success('商品已更新');
      } else {
        await productApi.create(payload);
        message.success('商品已新增');
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error('操作失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── 刪除 ─────────────────────────────────────────────

  /** 點擊刪除按鈕：開啟 Modal 並非同步載入相關庫存 */
  const handleDeleteClick = async (product: ApiProduct) => {
    setDeleteTarget(product);
    setRelatedInventories([]);
    setDeleteModalOpen(true);
    setDeleteCheckLoading(true);
    try {
      const all = await inventoryApi.getAll();
      setRelatedInventories(all.filter(inv => inv.productId === product.id));
    } catch {
      setRelatedInventories([]);
    } finally {
      setDeleteCheckLoading(false);
    }
  };

  /** 使用者確認刪除 */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteConfirming(true);
    try {
      if (relatedInventories.length > 0) {
        await productApi.forceDelete(deleteTarget.id);
      } else {
        await productApi.delete(deleteTarget.id);
      }
      message.success('商品已刪除');
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteModalOpen(false);
    } catch {
      message.error('刪除失敗，請稍後再試');
    } finally {
      setDeleteConfirming(false);
    }
  };

  const handleDeleteCancel = () => {
    if (deleteConfirming) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    setRelatedInventories([]);
  };

  /** 計算相關庫存的日期跨度 */
  const inventoryDateRange = useMemo(() => {
    if (relatedInventories.length === 0) return null;
    const times = relatedInventories.map(i => new Date(i.createdAt).getTime());
    const earliest = new Date(Math.min(...times)).toLocaleDateString('zh-TW');
    const latest = new Date(Math.max(...times)).toLocaleDateString('zh-TW');
    return { earliest, latest };
  }, [relatedInventories]);

  // ─── 表格欄位 ──────────────────────────────────────────

  const columns: ColumnsType<ApiProduct> = [
    {
      title: '商品名稱',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '分類',
      key: 'category',
      render: (_: unknown, record: ApiProduct) =>
        record.category
          ? <Tag>{record.category.name}</Tag>
          : <Text type="secondary">未分類</Text>,
    },
    {
      title: '單位',
      dataIndex: 'unit',
      key: 'unit',
      render: (unit: string | null) => unit ?? '-',
    },
    {
      title: '每日消耗率',
      dataIndex: 'avgConsumptionRate',
      key: 'avgConsumptionRate',
      render: (rate: number) =>
        rate === 0
          ? <Text type="secondary">不消耗</Text>
          : <Text>{(rate * 100).toFixed(1)}% / 天</Text>,
    },
    {
      title: '低庫存警示',
      dataIndex: 'lowStockThreshold',
      key: 'lowStockThreshold',
      render: (threshold: number) => `${(threshold * 100).toFixed(0)}%`,
    },
    {
      title: '條碼',
      dataIndex: 'barcode',
      key: 'barcode',
      render: (barcode: string | null) => barcode ?? '-',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_: unknown, record: ApiProduct) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => setHistoryTarget(record)}
          >
            紀錄
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            編輯
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record)}
          >
            刪除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        {/* 頁面標題 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>商品管理</Title>
            <Text type="secondary">共 {products.length} 項商品</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            新增商品
          </Button>
        </div>

        {error && (
          <Card style={{ marginBottom: 16 }}>
            <Text type="danger">{error}</Text>
          </Card>
        )}

        {/* 工具列 */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="搜尋商品..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            style={{ width: 140 }}
          />
        </Space>

        {/* 表格 */}
        <Card bodyStyle={{ padding: 0 }}>
          <Table<ApiProduct>
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* 新增 / 編輯 Modal */}
        <Modal
          title={editingProduct ? '編輯商品' : '新增商品'}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          okText={editingProduct ? '儲存' : '新增'}
          cancelText="取消"
          confirmLoading={submitting}
          destroyOnClose
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item
              label="商品名稱"
              name="name"
              rules={[{ required: true, message: '請輸入商品名稱' }]}
            >
              <Input placeholder="例：洗碗精" />
            </Form.Item>

            <Form.Item label="分類" name="categoryId">
              <Select
                placeholder="選擇分類（可不選）"
                allowClear
                options={categories.map(c => ({ value: c.id, label: c.name }))}
              />
            </Form.Item>

            <Form.Item label="單位" name="unit">
              <Input placeholder="例：瓶、包、kg" />
            </Form.Item>

            <Form.Item label="條碼" name="barcode">
              <Input placeholder="選填" />
            </Form.Item>

            <Form.Item
              label="每日平均消耗率（%）"
              name="avgConsumptionRate"
              rules={[{ required: true, message: '請輸入消耗率' }]}
              tooltip="設為 0 表示不消耗（如家電）"
            >
              <InputNumber min={0} max={100} precision={2} style={{ width: '100%' }} suffix="%" />
            </Form.Item>

            <Form.Item
              label="低庫存警示門檻（%）"
              name="lowStockThreshold"
              rules={[{ required: true, message: '請輸入警示門檻' }]}
              tooltip="庫存低於此百分比時觸發提醒"
            >
              <InputNumber min={0} max={100} precision={0} style={{ width: '100%' }} suffix="%" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 歷史紀錄 Modal */}
        <ProductHistoryModal
          open={historyTarget !== null}
          product={historyTarget}
          onClose={() => setHistoryTarget(null)}
        />

        {/* 刪除確認 Modal */}
        <Modal
          title={
            <Space>
              <WarningOutlined style={{ color: '#faad14' }} />
              刪除商品
            </Space>
          }
          open={deleteModalOpen}
          onCancel={handleDeleteCancel}
          footer={[
            <Button key="cancel" onClick={handleDeleteCancel} disabled={deleteConfirming}>
              取消
            </Button>,
            <Button
              key="confirm"
              danger
              type="primary"
              loading={deleteConfirming}
              disabled={deleteCheckLoading}
              onClick={handleDeleteConfirm}
            >
              確定刪除
            </Button>,
          ]}
        >
          <Spin spinning={deleteCheckLoading} tip="檢查相關庫存中...">
            <div style={{ minHeight: 60 }}>
              <Text>
                確定要刪除商品「<Text strong>{deleteTarget?.name}</Text>」嗎？
              </Text>

              {!deleteCheckLoading && relatedInventories.length > 0 && (
                <Alert
                  type="warning"
                  style={{ marginTop: 16 }}
                  message="此商品有相關的庫存記錄"
                  description={
                    <div style={{ marginTop: 8 }}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="庫存筆數">
                          {relatedInventories.length} 筆
                        </Descriptions.Item>
                        {inventoryDateRange && (
                          <Descriptions.Item label="建立日期範圍">
                            {inventoryDateRange.earliest === inventoryDateRange.latest
                              ? inventoryDateRange.earliest
                              : `${inventoryDateRange.earliest} ～ ${inventoryDateRange.latest}`}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                      <Text type="danger" style={{ fontSize: 13, marginTop: 8, display: 'block' }}>
                        確認後將連同所有相關庫存記錄一併刪除，此操作無法復原。
                      </Text>
                    </div>
                  }
                />
              )}

              {!deleteCheckLoading && relatedInventories.length === 0 && (
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  此商品目前沒有庫存記錄，可以安全刪除。
                </Text>
              )}
            </div>
          </Spin>
        </Modal>
      </div>
    </Spin>
  );
};

export default Products;
