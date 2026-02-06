// ============================================
// Reminders.jsx - 提醒事項頁面
// ============================================

import React, { useState } from 'react';
import { Card, Button, Tag, Space, Typography, Segmented, List, Avatar } from 'antd';
import { PlusOutlined, ShoppingCartOutlined, ClockCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { mockReminders } from './mockData';

const { Title, Text } = Typography;

export function Reminders() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockReminders : mockReminders.filter(r => r.type === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>提醒事項</Title>
          <Text type="secondary">管理您的購買與過期提醒</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>新增提醒</Button>
      </div>

      <Segmented
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: '全部' },
          { value: 'purchase', label: '🛒 補貨' },
          { value: 'expiry', label: '⏰ 過期' },
        ]}
        style={{ marginBottom: 16 }}
      />

      <List
        dataSource={filtered}
        renderItem={item => (
          <Card style={{ marginBottom: 12 }}>
            <List.Item
              actions={[<Button size="small" icon={<CheckOutlined />}>完成</Button>]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={item.type === 'purchase' ? <ShoppingCartOutlined /> : <ClockCircleOutlined />} />}
                title={
                  <Space>
                    <span>{item.item}</span>
                    <Tag color={item.priority === 'high' ? 'red' : 'orange'}>
                      {item.priority === 'high' ? '緊急' : '一般'}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div>{item.message}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                  </div>
                }
              />
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
}

// ============================================
// Budget.jsx - 預算追蹤頁面
// ============================================

import { Row, Col, Progress, Statistic, Select } from 'antd';
import { mockBudgetCategories } from './mockData';

export function Budget() {
  const total = mockBudgetCategories.reduce((s, c) => ({ spent: s.spent + c.spent, budget: s.budget + c.budget }), { spent: 0, budget: 0 });
  const percent = Math.round((total.spent / total.budget) * 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>預算追蹤</Title>
          <Text type="secondary">2026 年 2 月</Text>
        </div>
        <Select defaultValue="2026-02" options={[{ value: '2026-02', label: '2026 年 2 月' }, { value: '2026-01', label: '2026 年 1 月' }]} style={{ width: 150 }} />
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Statistic title="本月支出" value={total.spent} prefix="NT$" suffix={`/ NT$ ${total.budget.toLocaleString()}`} />
          </Col>
          <Col span={8}>
            <Progress percent={percent} status={percent > 90 ? 'exception' : 'active'} />
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {mockBudgetCategories.map(cat => (
          <Col span={12} key={cat.name} style={{ marginBottom: 16 }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text strong>{cat.name}</Text>
                <Text type="secondary">NT$ {cat.spent.toLocaleString()} / {cat.budget.toLocaleString()}</Text>
              </div>
              <Progress percent={Math.round((cat.spent / cat.budget) * 100)} strokeColor={cat.color} showInfo={false} />
              <Text type="secondary" style={{ fontSize: 13 }}>{Math.round((cat.spent / cat.budget) * 100)}%</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

// ============================================
// Settings.jsx - 設定頁面
// ============================================

import { Switch, Divider } from 'antd';

export function Settings() {
  const [notifications, setNotifications] = useState({ purchase: true, expiry: true, daily: false });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>設定</Title>
        <Text type="secondary">自訂您的 AI Housekeeper</Text>
      </div>

      <Card title="帳號設定" style={{ marginBottom: 16 }}>
        {[{ label: '家庭名稱', value: "Anthony's Home" }, { label: '成員管理', value: '2 位成員' }].map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div>
                <Text strong>{item.label}</Text>
                <br />
                <Text type="secondary">{item.value}</Text>
              </div>
              <Button type="link">編輯</Button>
            </div>
            {i === 0 && <Divider style={{ margin: 0 }} />}
          </div>
        ))}
      </Card>

      <Card title="通知設定" style={{ marginBottom: 16 }}>
        {[
          { key: 'purchase', label: '補貨提醒', desc: '庫存低於設定值時通知' },
          { key: 'expiry', label: '過期提醒', desc: '物品即將過期時通知' },
          { key: 'daily', label: '每日摘要', desc: '每天早上發送庫存摘要' },
        ].map((item, i) => (
          <div key={item.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div>
                <Text strong>{item.label}</Text>
                <br />
                <Text type="secondary">{item.desc}</Text>
              </div>
              <Switch checked={notifications[item.key]} onChange={v => setNotifications({ ...notifications, [item.key]: v })} />
            </div>
            {i < 2 && <Divider style={{ margin: 0 }} />}
          </div>
        ))}
      </Card>

      <Card title="資料管理">
        {[
          { label: '匯出資料', desc: '匯出所有庫存與紀錄（CSV/JSON）' },
          { label: '匯入資料', desc: '從檔案匯入庫存資料' },
        ].map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div>
                <Text strong>{item.label}</Text>
                <br />
                <Text type="secondary">{item.desc}</Text>
              </div>
              <Button>{item.label.slice(0, 2)}</Button>
            </div>
            {i === 0 && <Divider style={{ margin: 0 }} />}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ============================================
// AddItemModal.jsx - 新增物品 Modal
// ============================================

import { Modal, Form, Input, Select as AntSelect, DatePicker, InputNumber, Steps, Descriptions } from 'antd';
import { mockCategories, mockLocations, unitOptions } from './mockData';

export function AddItemModal({ open, onClose }) {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [{ title: '基本資訊' }, { title: '數量單位' }, { title: '消耗設定' }];

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      form.resetFields();
      setCurrentStep(0);
      onClose();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    onClose();
  };

  return (
    <Modal
      title="新增物品"
      open={open}
      onCancel={handleCancel}
      footer={
        <Space>
          {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>}
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleNext}>{currentStep < 2 ? '下一步' : '完成新增'}</Button>
        </Space>
      }
      width={560}
    >
      <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

      <Form form={form} layout="vertical">
        {currentStep === 0 && (
          <>
            <Form.Item name="name" label="物品名稱" rules={[{ required: true, message: '請輸入物品名稱' }]}>
              <Input placeholder="例：全脂牛奶" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="category" label="分類" rules={[{ required: true }]}>
                  <AntSelect placeholder="選擇分類" options={mockCategories.filter(c => c.value !== '全部')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="location" label="存放位置" rules={[{ required: true }]}>
                  <AntSelect placeholder="選擇位置" options={mockLocations.filter(l => l.value !== '全部')} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="quantity" label="數量" rules={[{ required: true }]}>
                  <InputNumber placeholder="0" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="unit" label="單位" rules={[{ required: true }]}>
                  <AntSelect options={unitOptions} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="expiryDate" label="有效期限（選填）">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Form.Item name="consumptionRate" label="預估每日消耗量">
              <InputNumber placeholder="0" style={{ width: '100%' }} addonAfter={form.getFieldValue('unit') + ' / 天'} />
            </Form.Item>
            <Text type="secondary" style={{ fontSize: 12 }}>系統會根據實際使用紀錄自動調整</Text>
            
            <Card size="small" style={{ marginTop: 16, backgroundColor: '#fafafa' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="物品名稱">{form.getFieldValue('name') || '-'}</Descriptions.Item>
                <Descriptions.Item label="分類">{form.getFieldValue('category') || '-'}</Descriptions.Item>
                <Descriptions.Item label="數量">{form.getFieldValue('quantity') || '0'} {form.getFieldValue('unit') || ''}</Descriptions.Item>
                <Descriptions.Item label="位置">{form.getFieldValue('location') || '-'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </>
        )}
      </Form>
    </Modal>
  );
}

export default { Reminders, Budget, Settings, AddItemModal };
