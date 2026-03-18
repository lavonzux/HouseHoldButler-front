import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Typography,
  message,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { expenditureApi } from "@/api/expenditure";
import type { ExpenditureItem } from "@/types/expenditure";
import type { CategoryOption } from "@/types/category.ts";
import { categoryApi } from "@/api/category";
import EditExpenditureModal from "@/components/component/EditExpenditureModal";
import DeleteConfirmModal from "@/components/component/DeleteConfirmModal";

const { Title, Text } = Typography;

const Expenditures: React.FC = () => {
  const [expenditureData, setExpenditureData] = useState<ExpenditureItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(""); // '' 表示全部
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExpenditureItem | null>(
    null,
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 當搜尋條件或分類改變時，重新載入支出資料
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const expenditureItems = await expenditureApi.getExpenditures({
          search,
          categoryId: selectedCategoryId,
        });
        setExpenditureData(expenditureItems);
      } catch (err) {
        message.error("載入支出資料失敗");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, selectedCategoryId]);

  const filteredData = useMemo(() => {
    return expenditureData.filter(
      (item) =>
        item.productName.toLowerCase().includes(search.toLowerCase()) &&
        (!selectedCategoryId || item.categoryId === selectedCategoryId),
    );
  }, [expenditureData, search, selectedCategoryId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categories = await categoryApi.getCategories();
        setCategories(categories);
      } catch (err) {
        message.error("無法載入分類資料");
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 準備 Select 的 options
  const categoryOptions = useMemo(() => {
    const opts = categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    }));

    return opts;
  }, [categories]);

  const columns: ColumnsType<ExpenditureItem> = [
    {
      title: "物品名稱 / 其他說明",
      dataIndex: "productName",
      key: "productName",
      align: "center",
      render: (productName) => <Text strong>{productName}</Text>,
    },
    {
      title: "分類",
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (category) => <span>{category || "未分類"}</span>,
    },
    {
      title: "支出日期",
      dataIndex: "expenditureDate",
      key: "expenditureDate",
      align: "center",
      render: (expenditureDate) => (
        <span>{dayjs(expenditureDate).format("YYYY/MM/DD")}</span>
      ),
    },
    {
      title: "金額",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `NT$ ${amount.toLocaleString()}`,
      align: "right",
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            onClick={() => {
              setSelectedItem(record);
              setEditModalOpen(true);
            }}
          >
            編輯
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              setItemToDelete(record.id);
              setDeleteModalOpen(true);
            }}
          >
            刪除
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);
    try {
      await expenditureApi.deleteExpenditure(itemToDelete);
      setExpenditureData((prev) =>
        prev.filter((item) => item.id !== itemToDelete),
      );
      message.success("刪除成功");
    } catch (err) {
      message.error("刪除失敗");
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            支出清單
          </Title>
          <Text type="secondary">共 {filteredData.length} 筆紀錄</Text>
        </div>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜尋物品名稱..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        {loadingCategories ? (
          <Spin size="small" />
        ) : (
          <Select
            value={selectedCategoryId}
            onChange={(value) => setSelectedCategoryId(value)}
            options={[{ label: "全部", value: "" }, ...categoryOptions]}
            style={{ width: 140 }}
            loading={loadingCategories}
            disabled={loadingCategories}
          />
        )}
      </Space>

      <Card
        styles={{
          body: { padding: 0 },
          header: { padding: 0 },
          cover: { padding: 0 },
        }}
      >
        <Table<ExpenditureItem>
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* 編輯 Modal */}
      <EditExpenditureModal
        open={editModalOpen}
        item={selectedItem}
        categoryOptions={categoryOptions}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={(updatedItem) => {
          setExpenditureData((prev) =>
            prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
          );
        }}
      />

      {/* 刪除確認 */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        title="刪除確認"
        content="確定要刪除這筆支出紀錄嗎？此操作無法復原。"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default Expenditures;
