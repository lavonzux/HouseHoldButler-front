// ============================================
// ProductHistoryModal.tsx - 商品歷史紀錄 Modal
// ============================================

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Timeline,
  Spin,
  Tag,
  Space,
  Typography,
  Empty,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  ToolOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ApiProduct, ProductHistoryEntry } from '@/types';
import { productApi } from '@api/inventory';

const { Text } = Typography;

const entryTypeLabel: Record<string, string> = {
  PURCHASE: '購入',
  DEPLETE: '耗盡',
  ADJUST: '數量調整',
  EXPIRE: '過期',
};

const entryTypeColor: Record<string, string> = {
  PURCHASE: '#1677ff',
  DEPLETE: '#8c8c8c',
  ADJUST: '#fa8c16',
  EXPIRE: '#f5222d',
};

const sourceLabel: Record<string, string> = {
  MANUAL: '手動',
  SYSTEM: '系統',
};

const inventoryStatusLabel: Record<string, string> = {
  ACTIVE: '使用中',
  DEPLETED: '已耗盡',
  EXPIRED: '已過期',
};

const inventoryStatusColor: Record<string, string> = {
  ACTIVE: 'green',
  DEPLETED: 'default',
  EXPIRED: 'red',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ProductHistoryModalProps {
  open: boolean;
  product: ApiProduct | null;
  onClose: () => void;
}

const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({
  open,
  product,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<ProductHistoryEntry[]>([]);

  useEffect(() => {
    if (!open || !product) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await productApi.getHistory(product.id);
        setEntries(data);
      } catch {
        message.error('無法載入歷史紀錄');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [open, product]);

  useEffect(() => {
    if (!open) setEntries([]);
  }, [open]);

  const timelineItems = entries.map((entry, index) => {
    const color = entryTypeColor[entry.entryType] ?? '#8c8c8c';

    const dot =
      entry.entryType === 'PURCHASE' ? (
        <ShoppingCartOutlined style={{ fontSize: 16, color }} />
      ) : entry.entryType === 'ADJUST' ? (
        <ToolOutlined style={{ fontSize: 14, color }} />
      ) : (
        <MinusCircleOutlined style={{ fontSize: 14, color }} />
      );

    const children =
      entry.entryType === 'PURCHASE' ? (
        <div style={{ paddingBottom: 4 }}>
          <Space wrap>
            <Text strong>{entryTypeLabel[entry.entryType]}</Text>
            <Tag color={inventoryStatusColor[entry.inventoryStatus] ?? 'default'}>
              {inventoryStatusLabel[entry.inventoryStatus] ?? entry.inventoryStatus}
            </Tag>
          </Space>
          <div style={{ marginTop: 2 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(entry.occurredAt)}</Text>
          </div>
          <div>初始數量：{entry.initialQuantity} {product?.unit ?? ''}</div>
          {entry.location && <div>位置：{entry.location}</div>}
          {entry.note && <div>備註：{entry.note}</div>}
        </div>
      ) : (
        <div style={{ paddingBottom: 4 }}>
          <Space wrap>
            <Text strong>{entryTypeLabel[entry.entryType] ?? entry.entryType}</Text>
            {entry.source && <Tag>{sourceLabel[entry.source] ?? entry.source}</Tag>}
          </Space>
          <div style={{ marginTop: 2 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>{formatDate(entry.occurredAt)}</Text>
          </div>
          {entry.entryType === 'ADJUST' && entry.quantityDelta !== null && (
            <div>調整至：{(entry.quantityDelta * 100).toFixed(0)}%</div>
          )}
          {entry.note && <div>備註：{entry.note}</div>}
        </div>
      );

    return { key: `${entry.entryType}-${entry.inventoryId}-${index}`, dot, children };
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Space>
          <ClockCircleOutlined />
          {product ? `${product.name} - 歷史紀錄` : '載入中...'}
        </Space>
      }
      width={600}
      footer={<Button onClick={onClose}>關閉</Button>}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {!loading && entries.length === 0 ? (
          <Empty description="尚無歷史紀錄" style={{ padding: '32px 0' }} />
        ) : (
          <div style={{ maxHeight: 500, overflowY: 'auto', padding: '16px 8px 0' }}>
            <Timeline items={timelineItems} />
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default ProductHistoryModal;
