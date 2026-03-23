import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Spin,
  Space,
  Button,
} from "antd";
import dayjs from "dayjs";
import { expenditureApi } from "@/api/expenditure";
import type { ExpenditureItem, ExpenditureFormData, ExpenditureFormDataOfRequest } from "@/types/expenditure";

interface EditExpenditureModalProps {
  open: boolean;
  item: ExpenditureItem | null;
  categoryOptions: { label: string; value: string }[];
  onClose: () => void;
  onSuccess: (updated: ExpenditureItem) => void;
}

const EditExpenditureModal: React.FC<EditExpenditureModalProps> = ({
  open,
  item,
  categoryOptions,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<ExpenditureFormData>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && item) {
      setLoading(true);
      form.setFieldsValue({
        productName: item.productName,
        categoryId: item.categoryId || undefined,
        category: item.category,
        amount: item.amount,
        expenditureDate: item.expenditureDate
          ? dayjs(item.expenditureDate)
          : null,
        description: item.description,
        source: item.source,
      });
      setLoading(false);
    } else {
      form.resetFields();
    }
  }, [open, item, form]);

  const handleSubmit = async (values: ExpenditureFormData) => {
    if (!item) return;

    setSubmitting(true);
    try {
      // 傳需要更新的欄位
      const updateData: Partial<ExpenditureFormDataOfRequest> = {
        amount: values.amount,
        expenditureDate: values.expenditureDate 
          ? values.expenditureDate.format('YYYY-MM-DD') 
          : null,
        description: values.description,
        source: values.source,
        categoryId: values.categoryId,
      };
      const updated = await expenditureApi.updateExpenditure(
        item.id,
        updateData,
      );

      // 若後端回傳的 updated
      onSuccess({
        ...item,
        ...updated
      });

      message.success("支出清單已更新");
      onClose();
    } catch (err) {
      console.error(err);
      message.error("更新失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="編輯支出清單"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnHidden
      forceRender
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin description="載入中..." />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ source: "現金" }}
        >
          <Form.Item
            name="productName"
            label="物品名稱"
            rules={[{ required: true, message: "請輸入物品名稱" }]}
          >
            <Input 
              placeholder="例如：牛奶、全脂牛奶..."
              disabled
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="分類"
            rules={[{ required: true, message: "請選擇分類" }]}
          >
            <Select placeholder="請選擇分類" options={categoryOptions} />
          </Form.Item>

          <Form.Item
            name="amount"
            label="金額 (NT$)"
            rules={[{ required: true, message: "請輸入金額" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              precision={0}
              placeholder="請輸入金額"
            />
          </Form.Item>

          <Form.Item
            name="expenditureDate"
            label="支出日期"
            rules={[{ required: true, message: "請選擇日期" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="description" label="說明 / 備註">
            <Input.TextArea
              rows={3}
              placeholder="可輸入購買地點、付款方式等資訊"
            />
          </Form.Item>

          <Form.Item name="source" label="付款方式">
            <Select
              options={[
                { label: "現金", value: "現金" },
                { label: "信用卡", value: "信用卡" },
                { label: "LINE Pay", value: "LINE Pay" },
                { label: "街口支付", value: "街口支付" },
                { label: "其他", value: "其他" },
              ]}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                儲存變更
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditExpenditureModal;
