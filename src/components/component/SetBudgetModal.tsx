import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Select,
  InputNumber,
  Space,
  Typography,
  Divider,
  Spin,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import type { ExistingCategoryLimit } from "@/types/budget.ts"
import type { CategoryOption } from "@/types/category.ts";
import { categoryApi } from "@/api/category.ts";
import { budgetApi } from "@/api/budget.ts";

const { Text } = Typography;

interface BudgetItem {
  key: number;
  categoryId: string | null;
  budgetAmount: number | null;
}

interface SetBudgetModalProps {
  open: boolean;
  selectedMonth: Dayjs;
  onClose: () => void;
  onSuccess: () => void;
}

let keyCounter = 0;
const nextKey = () => ++keyCounter;

// 將已存在的預算資料轉換為 Modal 內部使用的列表格式
const limitsToItems = (limits: ExistingCategoryLimit[]): BudgetItem[] => {
  if (limits.length === 0) {
    return [{ key: nextKey(), categoryId: null, budgetAmount: null }];
  }
  return limits.map((limit) => ({
    key: nextKey(),
    categoryId: limit.categoryId,
    budgetAmount: limit.budgetAmount,
  }));
};

const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
  open,
  selectedMonth,
  onClose,
  onSuccess,
}) => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<BudgetItem[]>([
    { key: nextKey(), categoryId: null, budgetAmount: null },
  ]);

  // 載入分類清單
  useEffect(() => {
    if (!open) return;
    setLoadingCategories(true);

    Promise.all([
      categoryApi.getCategories(),
      budgetApi.getCategoryLimits(selectedMonth.format("YYYY-MM")),
    ])
      .then(([cats, limits]) => {
        setCategories(cats);
        setItems(limitsToItems(limits));
      })
      .catch(() => message.error("無法載入資料，請稍後再試"))
      .finally(() => setLoadingCategories(false));
  }, [open, selectedMonth]);

  // Modal 關閉時重置
  const handleClose = () => {
    setItems([{ key: nextKey(), categoryId: null, budgetAmount: null }]);
    onClose();
  };

  // 新增一列
  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { key: nextKey(), categoryId: null, budgetAmount: null },
    ]);
  };

  // 刪除某列
  const removeRow = (key: number) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  // 更新某列的分類
  const updateCategory = (key: number, categoryId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, categoryId } : item))
    );
  };

  // 更新某列的預算金額
  const updateAmount = (key: number, budgetAmount: number | null) => {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, budgetAmount } : item
      )
    );
  };

  // 已被選擇的分類 ID（避免重複選擇）
  const selectedCategoryIds = items
    .map((item) => item.categoryId)
    .filter(Boolean) as string[];

  // 提交
  const handleSubmit = async () => {
    // 驗證
    const validItems = items.filter(
      (item) => item.categoryId && item.budgetAmount && item.budgetAmount > 0
    );

    if (validItems.length === 0) {
      message.warning("請至少填寫一筆完整的分類預算");
      return;
    }

    const hasIncomplete = items.some(
      (item) =>
        (item.categoryId && !item.budgetAmount) ||
        (!item.categoryId && item.budgetAmount)
    );

    if (hasIncomplete) {
      message.warning("請確認每一列的分類與金額都已填寫");
      return;
    }

    setSubmitting(true);
    try {
      await budgetApi.setBudgetLimits({
        yearMonth: selectedMonth.format("YYYY-MM-01"),
        items: validItems.map((item) => ({
          categoryId: item.categoryId!,
          budgetAmount: item.budgetAmount!,
        })),
      });
      message.success("預算設定成功");
      handleClose();
      onSuccess();
    } catch {
      message.error("預算設定失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`設定分類預算 — ${selectedMonth.format("YYYY 年 M 月")}`}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
        >
          儲存
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Spin spinning={loadingCategories}>
        {/* 表頭 */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 8,
            padding: "0 4px",
          }}
        >
          <Text type="secondary" style={{ flex: 1, fontSize: 13 }}>
            分類
          </Text>
          <Text type="secondary" style={{ flex: 1, fontSize: 13 }}>
            預算金額 (NT$)
          </Text>
          <div style={{ width: 32 }} />
        </div>

        {/* 預算列表 */}
        <Space direction="vertical" style={{ width: "100%" }} size={8}>
          {items.map((item) => (
            <div
              key={item.key}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              {/* 分類下拉 */}
              <Select
                style={{ flex: 1 }}
                placeholder="選擇分類"
                value={item.categoryId ?? undefined}
                onChange={(val) => updateCategory(item.key, val)}
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: (
                    <span>
                      {cat.icon && (
                        <span style={{ marginRight: 6 }}>{cat.icon}</span>
                      )}
                      {cat.name}
                    </span>
                  ),
                  disabled: selectedCategoryIds.includes(cat.id) && cat.id !== item.categoryId,
                }))}
                showSearch
                filterOption={(input, option) => {
                  const cat = categories.find((c) => c.id === option?.value);
                  return (
                    cat?.name.toLowerCase().includes(input.toLowerCase()) ??
                    false
                  );
                }}
              />

              {/* 金額輸入 */}
              <InputNumber
                style={{ flex: 1 }}
                placeholder="輸入預算金額"
                min={1}
                max={9999999}
                value={item.budgetAmount}
                onChange={(val) => updateAmount(item.key, val)}
                prefix="NT$"
                formatter={(val) =>
                  val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                }
                parser={(val) => Number(val?.replace(/,/g, "") ?? 0)}
              />

              {/* 刪除按鈕 */}
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeRow(item.key)}
                disabled={items.length === 1}
                style={{ width: 32, flexShrink: 0 }}
              />
            </div>
          ))}
        </Space>

        <Divider style={{ margin: "12px 0" }} />

        {/* 新增一列按鈕 */}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addRow}
          block
          disabled={items.length >= categories.length && categories.length > 0}
        >
          新增分類
        </Button>
      </Spin>
    </Modal>
  );
};

export default SetBudgetModal;
