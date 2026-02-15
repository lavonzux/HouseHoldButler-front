// ============================================
// ItemDetail.tsx - 物品詳情頁面
// ============================================
// 
// TypeScript 學習重點：
// 1. 處理 null 值的型別安全
// 2. 函式參數和回傳值型別
// 3. 條件渲染的型別
// ============================================

import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Tag, 
  Button, 
  InputNumber, 
  Space, 
  Typography, 
  Descriptions, 
  Timeline, 
  Alert,
} from 'antd';
import type { TimelineItemProps } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { InventoryItem, ConsumptionRecord } from '../types';
import { statusConfig } from '../theme';
import { mockConsumptionHistory, mockInventory } from '../mockData';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

/**
 * ItemDetail 元件
 */
const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 從 URL 參數獲取物品 ID
  // 根據 id 找到對應的物品（使用 useMemo 避免重複計算）
  const item = React.useMemo(() => {
    return mockInventory.find(i => i.id === Number(id));
  }, [id]);

  // 如果找不到物品，顯示錯誤或跳轉
  if (!item) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Title level={3}>找不到該物品</Title>
        <Button onClick={() => navigate('/inventory')}>返回庫存清單</Button>
      </div>
    );
  }
  const navigate = useNavigate();

  // 返回上一頁
  const handleBack = () => {
    navigate(-1);           // 或 navigate('/inventory')
  };

  // 使用傳入的 item.quantity 作為初始值
  const [quantity, setQuantity] = useState<number>(item.quantity);

  /**
   * 處理數量變更
   * InputNumber 的 onChange 回傳 number | null
   */
  const handleQuantityChange = (value: number | null): void => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  /**
   * 處理減少數量
   */
  const handleDecrease = (): void => {
    setQuantity(prev => Math.max(0, prev - 0.5));
  };

  /**
   * 處理增加數量
   */
  const handleIncrease = (): void => {
    setQuantity(prev => prev + 0.5);
  };

  /**
   * 將消耗紀錄轉換為 Timeline items
   */
  const timelineItems: TimelineItemProps[] = mockConsumptionHistory.map(
    (record: ConsumptionRecord) => ({
      children: (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Text strong>{record.date}</Text>
            {/* 使用可選鏈運算符處理可能不存在的 note */}
            {record.note && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {record.note}
              </Text>
            )}
          </div>
          <Text type="danger">-{record.amount} {item.unit}</Text>
        </div>
      ),
    })
  );

  return (
    <div>
      {/* 返回按鈕 */}
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack} 
        style={{ padding: 0, marginBottom: 16 }}
      >
        返回列表
      </Button>

      <Row gutter={16}>
        {/* 主要資訊卡片 */}
        <Col span={24}>
          <Card>
            {/* 標題區塊 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              marginBottom: 24,
            }}>
              <div>
                <Tag>{item.category}</Tag>
                <Title level={2} style={{ margin: '8px 0 0' }}>{item.name}</Title>
              </div>
              <Tag 
                color={statusConfig[item.status].tagColor} 
                style={{ fontSize: 14, padding: '4px 12px' }}
              >
                {statusConfig[item.status].label}
              </Tag>
            </div>

            {/* 詳細資訊 */}
            <Descriptions bordered column={3} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="目前數量">
                {quantity} {item.unit}
              </Descriptions.Item>
              <Descriptions.Item label="存放位置">
                {item.location}
              </Descriptions.Item>
              <Descriptions.Item label="日均消耗">
                {item.consumptionRate} {item.unit}/天
              </Descriptions.Item>
              <Descriptions.Item label="預計用完">
                {item.daysUntilEmpty} 天後
              </Descriptions.Item>
              <Descriptions.Item label="有效期限">
                {/* 處理 null 值，顯示 '-' */}
                {item.expiryDate ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="最後更新">
                {item.lastUpdated}
              </Descriptions.Item>
            </Descriptions>

            {/* 數量調整 */}
            <Space>
              <Button onClick={handleDecrease}>−</Button>
              <InputNumber 
                value={quantity} 
                onChange={handleQuantityChange} 
                style={{ width: 80 }} 
                min={0}
                step={0.5}
              />
              <Text type="secondary">{item.unit}</Text>
              <Button onClick={handleIncrease}>+</Button>
              <Button type="primary">更新數量</Button>
            </Space>
          </Card>
        </Col>

        {/* 消耗紀錄 */}
        <Col span={12} style={{ marginTop: 16 }}>
          <Card title="📜 消耗紀錄">
            <Timeline items={timelineItems} />
            <Button type="link" style={{ padding: 0 }}>
              查看完整紀錄 →
            </Button>
          </Card>
        </Col>

        {/* AI 建議 */}
        <Col span={12} style={{ marginTop: 16 }}>
          <Card title="🤖 AI 建議">
            <Alert
              type="info"
              message={
                <span>
                  根據您過去 30 天的消耗模式，建議在 <strong>2 天內</strong> 購買 {item.name}。
                </span>
              }
              description={`預估需要購買 2 ${item.unit}，可維持約 2 週使用量。`}
              style={{ marginBottom: 16 }}
            />
            <Button icon={<ShoppingCartOutlined />}>
              加入購物清單
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ItemDetail;
