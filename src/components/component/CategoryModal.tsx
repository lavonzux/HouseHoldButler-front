import React, { useState } from 'react';
import {
  Modal,
  List,
  Input,
  Button,
  Space,
  Typography,
  Popconfirm,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ApiCategory } from '@/types';
import { categoryApi } from '@api/inventory';

const { Text } = Typography;

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  categories: ApiCategory[];
  onCategoriesChange: (categories: ApiCategory[]) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  categories,
  onCategoriesChange,
}) => {
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    try {
      setAdding(true);
      const created = await categoryApi.create(trimmed);
      onCategoriesChange([...categories, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName('');
      message.success(`已新增分類「${created.name}」`);
    } catch {
      message.error('新增分類失敗');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (category: ApiCategory) => {
    try {
      setDeletingId(category.id);
      await categoryApi.delete(category.id);
      onCategoriesChange(categories.filter(c => c.id !== category.id));
      message.success(`已刪除分類「${category.name}」`);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        message.error('此分類仍有物品，無法刪除');
      } else {
        message.error('刪除分類失敗');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Modal
      title="分類管理"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>關閉</Button>}
      width={420}
    >
      {/* 新增分類 */}
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Input
          placeholder="輸入新分類名稱"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onPressEnter={handleAdd}
          maxLength={50}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          loading={adding}
          disabled={!newName.trim()}
        >
          新增
        </Button>
      </Space.Compact>

      {/* 分類清單 */}
      <List
        dataSource={categories}
        locale={{ emptyText: '尚無分類，請新增' }}
        renderItem={category => (
          <List.Item
            actions={[
              <Popconfirm
                key="delete"
                title={`確定刪除「${category.name}」？`}
                description="若該分類仍有物品則無法刪除"
                onConfirm={() => handleDelete(category)}
                okText="刪除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deletingId === category.id}
                  size="small"
                />
              </Popconfirm>,
            ]}
          >
            <Text>{category.name}</Text>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default CategoryModal;
