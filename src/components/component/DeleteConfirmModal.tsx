import React from "react";
import { Modal } from "antd";
import type { ModalProps } from "antd";

interface DeleteConfirmModalProps extends Omit<ModalProps, "title"> {
  open: boolean;
  onOk: () => void | Promise<void>;
  onCancel: () => void;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onOk,
  onCancel,
  title = "刪除確認",
  content = "確定要刪除這筆紀錄嗎？此操作無法復原。",
  confirmText = "確定刪除",
  cancelText = "取消",
  isLoading = false,
  ...rest
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{ danger: true, loading: isLoading }}
      confirmLoading={isLoading}
      {...rest}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default DeleteConfirmModal;