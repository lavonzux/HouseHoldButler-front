// ============================================
// InventoryDetailModal.tsx - 庫存詳情 Modal
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Button,
  Descriptions,
  Input,
  Spin,
  Tag,
  Space,
  Typography,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ApiInventory } from '@/types';
import { inventoryApi } from '@api/inventory';
import { statusConfig } from '@/theme';
import { mapApiInventoryToItem } from '@/utils/inventoryMapper';

const { Text } = Typography;

type NoteSaveStatus = 'idle' | 'saving' | 'saved';

interface InventoryDetailModalProps {
  open: boolean;
  inventoryId: string | null;
  onClose: () => void;
}

const InventoryDetailModal: React.FC<InventoryDetailModalProps> = ({
  open,
  inventoryId,
  onClose,
}) => {
  const navigate = useNavigate();
  const [apiInventory, setApiInventory] = useState<ApiInventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [noteSaveStatus, setNoteSaveStatus] = useState<NoteSaveStatus>('idle');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open || !inventoryId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await inventoryApi.getById(inventoryId);
        setApiInventory(data);
        setNote(data.note ?? '');
        setNoteSaveStatus('idle');
      } catch {
        message.error('無法載入庫存詳情');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, inventoryId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setApiInventory(null);
      setNote('');
      setNoteSaveStatus('idle');
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    }
  }, [open]);

  const handleNoteChange = (value: string) => {
    setNote(value);
    setNoteSaveStatus('saving');

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (!inventoryId) return;
      try {
        await inventoryApi.updateNote(inventoryId, value);
        setNoteSaveStatus('saved');
      } catch {
        message.error('備註儲存失敗');
        setNoteSaveStatus('idle');
      }
    }, 1000);
  };

  const handleNavigateToProduct = () => {
    if (!inventoryId) return;
    onClose();
    navigate(`/inventory/${inventoryId}`);
  };

  const displayItem = apiInventory ? mapApiInventoryToItem(apiInventory) : null;
  const product = apiInventory?.product ?? null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={product?.name ?? '載入中...'}
      width={600}
      footer={
        <Space>
          <Button onClick={onClose}>關閉</Button>
          <Button type="primary" onClick={handleNavigateToProduct}>
            前往商品頁面
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        {apiInventory && displayItem && (
          <>
            {/* 商品資訊 */}
            <Descriptions
              title="商品資訊"
              bordered
              size="small"
              column={2}
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="分類">
                {product?.category?.name ?? '未分類'}
              </Descriptions.Item>
              <Descriptions.Item label="單位">
                {product?.unit ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="條碼">
                {product?.barcode ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="低庫存門檻">
                {product?.lowStockThreshold ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="平均消耗率" span={2}>
                {product?.avgConsumptionRate ?? 0} / 天
              </Descriptions.Item>
            </Descriptions>

            {/* 庫存狀態 */}
            <Descriptions
              title="庫存狀態"
              bordered
              size="small"
              column={2}
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="狀態">
                <Tag color={statusConfig[displayItem.status].tagColor}>
                  {statusConfig[displayItem.status].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="目前數量">
                {displayItem.quantity} {displayItem.unit}
              </Descriptions.Item>
              <Descriptions.Item label="位置">
                {apiInventory.location ?? '-'}
              </Descriptions.Item>
              <Descriptions.Item label="預計用完">
                <Text type={displayItem.daysUntilEmpty <= 3 ? 'danger' : displayItem.daysUntilEmpty <= 7 ? 'warning' : 'secondary'}>
                  {displayItem.daysUntilEmpty} 天
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="有效期限" span={2}>
                {apiInventory.nearestExpiryDate ?? '-'}
              </Descriptions.Item>
            </Descriptions>

            {/* 備註 */}
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>
                備註
              </Text>
              <Input.TextArea
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                rows={3}
                placeholder="輸入備註..."
              />
              <div style={{ height: 18, marginTop: 4 }}>
                {noteSaveStatus === 'saving' && (
                  <Text type="secondary" style={{ fontSize: 12 }}>儲存中...</Text>
                )}
                {noteSaveStatus === 'saved' && (
                  <Text type="success" style={{ fontSize: 12 }}>已儲存</Text>
                )}
              </div>
            </div>
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default InventoryDetailModal;
