import apiClient from '@api/client';
import type { CategoryOption } from '@/types/category.ts';

export const categoryApi = {
     // 取得所有分類（供新增預算 Modal 的下拉選單使用）
    getCategories: async (): Promise<CategoryOption[]> => {
        const response = await apiClient.get<CategoryOption[]>('/api/Categories/getCategories');
        return response.data;
    },
}