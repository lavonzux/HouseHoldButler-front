import client from "./client";
import type { ExpenditureItem, ExpenditureFormData, ExpenditureFormDataOfRequest } from "@/types/expenditure";

export const expenditureApi = {
  // 取得支出清單資料 (可根據條件進行篩選) ; @param params - 查詢參數 { search?: string; categoryId?: string; } ; @returns 支出清單陣列
  getExpenditures: async (params?: {search?: string; categoryId?: string;}): Promise<ExpenditureItem[]> => {
    const response = await client.get("/api/Expenditures/getExpenditures", { params });
    return response.data;
  },

   // 取得單筆支出詳細資料（供編輯使用）; @param id - 支出紀錄 ID ; @returns 單筆支出清單詳細資料
  getExpenditure: async (id: string): Promise<ExpenditureItem> => {
    const response = await client.get(`/api/Expenditures/getExpenditure/${id}`);
    return response.data;
  },

  // 新增支出紀錄資料 ; @param data - 支出表單資料 ; @returns 新增後的支出清單
  createExpenditure: async (data: ExpenditureFormDataOfRequest): Promise<ExpenditureItem> => {
    const response = await client.post("/api/Expenditures/createExpenditure", data);
    return response.data;
  },

  // 更新支出清單資料 ; @param id - 支出紀錄 ID ; @param data - 部分更新的資料 ; @returns 更新後的支出清單
  updateExpenditure: async (id: string, data: Partial<ExpenditureFormDataOfRequest>): Promise<ExpenditureItem> => {
    const response = await client.put(`/api/Expenditures/updateExpenditure/${id}`, data);
    return response.data;
  },

  // 刪除支出清單資料 ; @param id - 支出紀錄 ID
  deleteExpenditure: async (id: string): Promise<void> => {
    await client.delete(`/api/Expenditures/deleteExpenditure/${id}`);
  },
};
