// ============================================
// AddItemModal.tsx - 新增物品 Modal
// ============================================
// 
// TypeScript 學習重點：
// 1. Ant Design Form 的型別用法
// 2. 泛型函式的使用
// 3. 表單驗證的型別
// ============================================

import React, { useState } from 'react';
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
} from 'antd';
// import type { FormInstance } from 'antd';
import type { AddItemModalProps, AddItemFormData } from '@/types';
import { mockCategories, mockLocations, unitOptions } from '@/mockData';

const { Text } = Typography;

/**
 * AddItemModal 元件
 */
const AddItemModal: React.FC<AddItemModalProps> = ({ open, onClose, onSubmit }) => {
  /**
   * 使用 Form.useForm 並指定泛型
   * 這樣 form 實例就會有正確的型別提示
   */
  const [form] = Form.useForm<AddItemFormData>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // 步驟定義
  const steps = [
    { title: '基本資訊' },
    { title: '數量單位' },
    { title: '消耗設定' },
  ];

  /**
   * 處理下一步
   */
  const handleNext = async (): Promise<void> => {
    try {
      // 驗證當前步驟的欄位
      if (currentStep === 0) {
        await form.validateFields(['name', 'category', 'location']);
      } else if (currentStep === 1) {
        await form.validateFields(['quantity', 'unit']);
      }
      
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        handleFinish();
      }
    } catch (error) {
      // 驗證失敗，不進行下一步
      console.log('Validation failed:', error);
    }
  };

  /**
   * 處理完成
   */
  const handleFinish = (): void => {
    form.validateFields()
      .then((values: AddItemFormData) => {
        console.log('Form values:', values);
        onSubmit?.(values);
        handleCancel();
      })
      .catch((error) => {
        console.log('Validation failed:', error);
      });
  };

  /**
   * 處理取消
   */
  const handleCancel = (): void => {
    form.resetFields();
    setCurrentStep(0);
    onClose();
  };

  /**
   * 處理上一步
   */
  const handlePrevious = (): void => {
    setCurrentStep(currentStep - 1);
  };

  /**
   * 取得表單值（用於顯示確認資訊）
   */
  const getFormValue = <K extends keyof AddItemFormData>(key: K): AddItemFormData[K] => {
    return form.getFieldValue(key);
  };

  return (
    <Modal
      title="新增物品"
      open={open}
      onCancel={handleCancel}
      footer={
        <Space>
          {currentStep > 0 && (
            <Button onClick={handlePrevious}>上一步</Button>
          )}
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleNext}>
            {currentStep < 2 ? '下一步' : '完成新增'}
          </Button>
        </Space>
      }
      width={560}
      destroyOnClose
    >
      {/* 步驟指示器 */}
      <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

      {/* 表單 */}
      <Form<AddItemFormData>
        form={form}
        layout="vertical"
        initialValues={{
          unit: '個',
          quantity: null,
          consumptionRate: null,
        }}
      >
        {/* 步驟 1: 基本資訊 */}
        {currentStep === 0 && (
          <>
            <Form.Item
              name="name"
              label="物品名稱"
              rules={[{ required: true, message: '請輸入物品名稱' }]}
            >
              <Input placeholder="例：全脂牛奶" />
            </Form.Item>
            <Space style={{ display: 'flex' }} align="start">
              <Form.Item
                name="category"
                label="分類"
                rules={[{ required: true, message: '請選擇分類' }]}
                style={{ flex: 1 }}
              >
                <Select
                  placeholder="選擇分類"
                  options={mockCategories.filter(c => c.value !== '全部')}
                />
              </Form.Item>
              <Form.Item
                name="location"
                label="存放位置"
                rules={[{ required: true, message: '請選擇位置' }]}
                style={{ flex: 1 }}
              >
                <Select
                  placeholder="選擇位置"
                  options={mockLocations.filter(l => l.value !== '全部')}
                />
              </Form.Item>
            </Space>
          </>
        )}

        {/* 步驟 2: 數量單位 */}
        {currentStep === 1 && (
          <>
            <Space style={{ display: 'flex' }} align="start">
              <Form.Item
                name="quantity"
                label="數量"
                rules={[{ required: true, message: '請輸入數量' }]}
                style={{ flex: 1 }}
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                  step={0.5}
                />
              </Form.Item>
              <Form.Item
                name="unit"
                label="單位"
                rules={[{ required: true, message: '請選擇單位' }]}
                style={{ flex: 1 }}
              >
                <Select options={unitOptions} />
              </Form.Item>
            </Space>
            <Form.Item name="expiryDate" label="有效期限（選填）">
              <DatePicker style={{ width: '100%' }} placeholder="選擇日期" />
            </Form.Item>
          </>
        )}

        {/* 步驟 3: 消耗設定 */}
        {currentStep === 2 && (
          <>
            <Form.Item name="consumptionRate" label="預估每日消耗量">
              <InputNumber
                placeholder="0"
                style={{ width: '100%' }}
                min={0}
                step={0.1}
                addonAfter={`${getFormValue('unit') || ''} / 天`}
              />
            </Form.Item>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
              系統會根據實際使用紀錄自動調整
            </Text>

            {/* 確認資訊 */}
            <Card size="small" style={{ backgroundColor: '#fafafa' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="物品名稱">
                  {getFormValue('name') || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="分類">
                  {getFormValue('category') || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="數量">
                  {getFormValue('quantity') ?? 0} {getFormValue('unit') || ''}
                </Descriptions.Item>
                <Descriptions.Item label="位置">
                  {getFormValue('location') || '-'}
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
