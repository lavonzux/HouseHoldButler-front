// ============================================
// ItemDetail.jsx - 物品詳情頁面
// ============================================

import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, InputNumber, Space, Typography, Descriptions, Timeline, Alert } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { statusConfig } from './theme';

const { Title, Text } = Typography;

export default function ItemDetail({ item, onBack }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const history = [
    { date: '2026-02-04', amount: 0.5, note: '早餐使用' },
    { date: '2026-02-03', amount: 0.5, note: '' },
    { date: '2026-02-02', amount: 1, note: '做蛋糕' },
    { date: '2026-02-01', amount: 0.5, note: '' },
  ];

  return (
    <div>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ padding: 0, marginBottom: 16 }}>
        返回列表
      </Button>

      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <Tag>{item.category}</Tag>
                <Title level={2} style={{ margin: '8px 0 0' }}>{item.name}</Title>
              </div>
              <Tag color={statusConfig[item.status].tagColor} style={{ fontSize: 14, padding: '4px 12px' }}>
                {statusConfig[item.status].label}
              </Tag>
            </div>

            <Descriptions bordered column={3} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="目前數量">{quantity} {item.unit}</Descriptions.Item>
              <Descriptions.Item label="存放位置">{item.location}</Descriptions.Item>
              <Descriptions.Item label="日均消耗">{item.consumptionRate} {item.unit}/天</Descriptions.Item>
              <Descriptions.Item label="預計用完">{item.daysUntilEmpty} 天後</Descriptions.Item>
              <Descriptions.Item label="有效期限">{item.expiryDate || '-'}</Descriptions.Item>
              <Descriptions.Item label="最後更新">{item.lastUpdated}</Descriptions.Item>
            </Descriptions>

            <Space>
              <Button onClick={() => setQuantity(Math.max(0, quantity - 0.5))}>−</Button>
              <InputNumber value={quantity} onChange={setQuantity} style={{ width: 80 }} />
              <Text type="secondary">{item.unit}</Text>
              <Button onClick={() => setQuantity(quantity + 0.5)}>+</Button>
              <Button type="primary">更新數量</Button>
            </Space>
          </Card>
        </Col>

        <Col span={12} style={{ marginTop: 16 }}>
          <Card title="📜 消耗紀錄">
            <Timeline items={history.map(h => ({
              children: (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong>{h.date}</Text>
                    {h.note && <Text type="secondary" style={{ marginLeft: 8 }}>{h.note}</Text>}
                  </div>
                  <Text type="danger">-{h.amount} {item.unit}</Text>
                </div>
              ),
            }))} />
            <Button type="link" style={{ padding: 0 }}>查看完整紀錄 →</Button>
          </Card>
        </Col>

        <Col span={12} style={{ marginTop: 16 }}>
          <Card title="🤖 AI 建議">
            <Alert
              type="info"
              message={<span>根據您過去 30 天的消耗模式，建議在 <strong>2 天內</strong> 購買 {item.name}。</span>}
              description={`預估需要購買 2 ${item.unit}，可維持約 2 週使用量。`}
              style={{ marginBottom: 16 }}
            />
            <Button icon={<ShoppingCartOutlined />}>加入購物清單</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
