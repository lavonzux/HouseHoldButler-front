// ============================================
// AddItemModal.tsx - 新增庫存 Modal
// ============================================

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Steps,
  Card,
  Descriptions,
  Space,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { AddItemModalProps, AddItemFormData, ApiProduct } from '@/types';
import { mockLocations } from '@/mockData';
import { productApi } from '@api/inventory';

const { Text, Link } = Typography;

// 完整的表單欄位型別（含商品欄位，不對外暴露）
type FullFormValues = {
  productId?: string;
  location?: string;
  quantity?: number | null;
  expiryDate?: string | null;
  productName?: string;
  productCategoryId?: string;
  productUnit?: string;
  productBarcode?: string;
  productAvgConsumptionRate?: number;
  productLowStockThreshold?: number;
};

/**
 * AddItemModal 元件
 * Step 1: 選擇或新增商品（含商品詳細資料內嵌編輯）+ 存放位置
 * Step 2: 數量、有效期限、確認摘要
 */
const AddItemModal: React.FC<AddItemModalProps> = ({
  open,
  onClose,
  onSubmit,
  products,
  categories,
}) => {
  const [form] = Form.useForm<FullFormValues>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isNewProductMode, setIsNewProductMode] = useState(false);
  const [localProducts, setLocalProducts] = useState<ApiProduct[]>(products ?? []);
  const [submitting, setSubmitting] = useState(false);

  // 每次 Modal 開啟時，同步父層傳入的商品清單
  useEffect(() => {
    if (open) {
      setLocalProducts(products ?? []);
    }
  }, [open, products]);

  const steps = [
    { title: '選擇商品' },
    { title: '數量與日期' },
  ];

  // ─── 商品選取 ────────────────────────────────────────

  /** 從 Select 選擇商品後，預填所有商品欄位 */
  const handleProductSelect = (productId: string) => {
    const product = localProducts.find(p => p.id === productId);
    if (!product) return;
    form.setFieldsValue({
      productName: product.name,
      productCategoryId: product.categoryId ?? undefined,
      productUnit: product.unit ?? undefined,
      productBarcode: product.barcode ?? undefined,
      productAvgConsumptionRate: +(product.avgConsumptionRate * 100).toFixed(2),
      productLowStockThreshold: +(product.lowStockThreshold * 100).toFixed(0),
    });
  };

  // ─── 新增商品模式 ─────────────────────────────────────

  const handleNewProductMode = () => {
    form.setFieldsValue({
      productId: undefined,
      productName: undefined,
      productCategoryId: undefined,
      productUnit: undefined,
      productBarcode: undefined,
      productAvgConsumptionRate: 0,
      productLowStockThreshold: 20,
    });
    setIsNewProductMode(true);
  };

  const handleCancelNewProduct = () => {
    form.setFieldsValue({
      productName: undefined,
      productCategoryId: undefined,
      productUnit: undefined,
      productBarcode: undefined,
      productAvgConsumptionRate: undefined,
      productLowStockThreshold: undefined,
    });
    setIsNewProductMode(false);
  };

  // ─── 步驟導覽 ─────────────────────────────────────────

  const handleNext = async (): Promise<void> => {
    if (currentStep === 0) {
      try {
        const fieldsToValidate: string[] = [
          'productName',
          'productAvgConsumptionRate',
          'productLowStockThreshold',
          'location',
        ];
        if (!isNewProductMode) {
          fieldsToValidate.push('productId');
        }
        await form.validateFields(fieldsToValidate);

        setSubmitting(true);
        const values = form.getFieldsValue(true) as FullFormValues;

        const productPayload = {
          name: values.productName!,
          categoryId: values.productCategoryId ?? null,
          barcode: values.productBarcode || null,
          unit: values.productUnit || null,
          avgConsumptionRate: (values.productAvgConsumptionRate ?? 0) / 100,
          lowStockThreshold: (values.productLowStockThreshold ?? 20) / 100,
        };

        let resolvedId: string;

        if (isNewProductMode) {
          const created = await productApi.create(productPayload);
          resolvedId = created.id;
          setLocalProducts(prev => [...prev, created]);
          setIsNewProductMode(false);
        } else {
          const existingId = values.productId!;
          const updated = await productApi.update(existingId, productPayload);
          resolvedId = existingId;
          setLocalProducts(prev => prev.map(p => p.id === existingId ? updated : p));
        }

        // 將 resolved productId 寫回表單供 Step 2 使用
        form.setFieldValue('productId', resolvedId);
        setCurrentStep(1);
      } catch (err) {
        if (err && typeof err === 'object' && 'errorFields' in err) return;
        message.error('商品操作失敗，請稍後再試');
      } finally {
        setSubmitting(false);
      }

    } else if (currentStep === 1) {
      try {
        await form.validateFields(['quantity']);
        handleFinish();
      } catch {
        // 驗證失敗，不進行
      }
    }
  };

  const handlePrevious = (): void => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = (): void => {
    const values = form.getFieldsValue(true) as FullFormValues;
    const data: AddItemFormData = {
      productId: values.productId!,
      location: values.location!,
      quantity: values.quantity ?? null,
      expiryDate: values.expiryDate ?? null,
    };
    onSubmit?.(data);
    handleCancel();
  };

  const handleCancel = (): void => {
    form.resetFields();
    setCurrentStep(0);
    setIsNewProductMode(false);
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal
      title="新增庫存"
      open={open}
      onCancel={handleCancel}
      footer={
        <Space>
          {currentStep > 0 && (
            <Button onClick={handlePrevious} disabled={submitting}>上一步</Button>
          )}
          <Button onClick={handleCancel} disabled={submitting}>取消</Button>
          <Button type="primary" onClick={handleNext} loading={submitting}>
            {currentStep < steps.length - 1 ? '下一步' : '完成新增'}
          </Button>
        </Space>
      }
      width={560}
    >
      {/* 步驟指示器 */}
      <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

      <Form form={form} layout="vertical">

        {/* ── Step 1: 選擇商品 ── */}
        {currentStep === 0 && (
          <>
            {/* 商品選取列 */}
            <Form.Item label="商品" style={{ marginBottom: 0 }}>
              <Row gutter={8} align="middle">
                <Col flex="auto" style={{ display: isNewProductMode ? 'none' : undefined }}>
                  <Form.Item
                    name="productId"
                    noStyle
                    rules={[{ required: !isNewProductMode, message: '請選擇商品' }]}
                  >
                    <Select
                      showSearch
                      placeholder="搜尋或選擇商品"
                      filterOption={(input, option) =>
                        (option?.label as string ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={localProducts.map(p => ({
                        value: p.id,
                        label: p.category ? `${p.name}（${p.category.name}）` : p.name,
                      }))}
                      onChange={handleProductSelect}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                {isNewProductMode && (
                  <Col flex="auto">
                    <Text type="secondary">新增商品</Text>
                  </Col>
                )}
                <Col flex="none">
                  {isNewProductMode ? (
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={handleCancelNewProduct}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      取消新增
                    </Button>
                  ) : (
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={handleNewProductMode}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      新增商品
                    </Button>
                  )}
                </Col>
              </Row>
            </Form.Item>

            {/* 商品詳細欄位：選取商品後或新增模式下顯示 */}
            <Form.Item
              noStyle
              shouldUpdate={(prev: FullFormValues, curr: FullFormValues) =>
                prev.productId !== curr.productId
              }
            >
              {() => {
                const productId = form.getFieldValue('productId') as string | undefined;
                if (!isNewProductMode && !productId) return null;

                return (
                  <>
                    <Divider plain style={{ marginTop: 16, marginBottom: 12 }}>
                      商品詳細資料
                    </Divider>

                    <Form.Item
                      name="productName"
                      label="商品名稱"
                      rules={[{ required: true, message: '請輸入商品名稱' }]}
                    >
                      <Input placeholder="例：洗碗精" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="productCategoryId" label="分類">
                          <Select
                            placeholder="選擇分類（可不選）"
                            allowClear
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="productUnit" label="單位">
                          <Input placeholder="例：瓶、包、kg" autoComplete="on" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name="productBarcode" label="條碼（選填）">
                      <Input placeholder="掃描或手動輸入" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="productAvgConsumptionRate"
                          label="每日消耗率"
                          rules={[{ required: true, message: '請輸入消耗率' }]}
                          tooltip="設為 0 表示不消耗（如家電）"
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            precision={2}
                            style={{ width: '100%' }}
                            suffix={<span style={{ whiteSpace: 'nowrap' }}>% / 天</span>}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="productLowStockThreshold"
                          label="低庫存警示"
                          rules={[{ required: true, message: '請輸入警示門檻' }]}
                          tooltip="庫存低於此百分比時觸發提醒"
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            precision={0}
                            style={{ width: '100%' }}
                            suffix="%"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                );
              }}
            </Form.Item>

            {/* 存放位置（永遠顯示） */}
            <Form.Item
              name="location"
              label="存放位置"
              rules={[{ required: true, message: '請選擇位置' }]}
            >
              <Select
                placeholder="選擇位置"
                options={mockLocations.filter(l => l.value !== '全部')}
              />
            </Form.Item>
          </>
        )}

        {/* ── Step 2: 數量與日期 ── */}
        {currentStep === 1 && (
          <>
            <Form.Item noStyle shouldUpdate>
              {() => (
                <Form.Item
                  name="quantity"
                  label="數量"
                  rules={[{ required: true, message: '請輸入數量' }]}
                >
                  <InputNumber
                    placeholder="0"
                    style={{ width: '100%' }}
                    min={0}
                    step={0.5}
                    suffix={<span style={{ whiteSpace: 'nowrap' }}>{form.getFieldValue('productUnit') ?? '個'}</span>}
                  />
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item name="expiryDate" label="有效期限（選填）">
              <DatePicker style={{ width: '100%' }} placeholder="選擇日期" />
            </Form.Item>

            {/* 確認摘要 */}
            <Card size="small" style={{ backgroundColor: '#fafafa' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="商品名稱">
                  {form.getFieldValue('productName') ?? '-'}
                </Descriptions.Item>
                <Descriptions.Item label="分類">
                  {categories.find(
                    c => c.id === form.getFieldValue('productCategoryId')
                  )?.name ?? '未分類'}
                </Descriptions.Item>
                <Form.Item noStyle shouldUpdate={(p: FullFormValues, c: FullFormValues) => p.quantity !== c.quantity}>
                  {() => (
                    <Descriptions.Item label="數量">
                      {form.getFieldValue('quantity') ?? 0}{' '}
                      {form.getFieldValue('productUnit') ?? '個'}
                    </Descriptions.Item>
                  )}
                </Form.Item>
                <Descriptions.Item label="位置">
                  {form.getFieldValue('location') ?? '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AddItemModal;
