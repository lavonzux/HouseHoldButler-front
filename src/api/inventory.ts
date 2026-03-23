import apiClient from '@api/client'
import type {
  ApiInventory,
  ApiProduct,
  ApiCategory,
  CreateProductApiRequest,
  UpdateProductApiRequest,
  CreateInventoryApiRequest,
} from '@/types'

export const inventoryApi = {
  getAll: async (): Promise<ApiInventory[]> => {
    const response = await apiClient.get<ApiInventory[]>('/api/inventories')
    return response.data
  },

  getById: async (id: string): Promise<ApiInventory> => {
    const response = await apiClient.get<ApiInventory>(`/api/inventories/${id}`)
    return response.data
  },

  create: async (data: CreateInventoryApiRequest): Promise<ApiInventory> => {
    const response = await apiClient.post<ApiInventory>('/api/inventories', data)
    return response.data
  },
}

export const productApi = {
  getAll: async (): Promise<ApiProduct[]> => {
    const response = await apiClient.get<ApiProduct[]>('/api/products')
    return response.data
  },

  create: async (data: CreateProductApiRequest): Promise<ApiProduct> => {
    const response = await apiClient.post<ApiProduct>('/api/products', data)
    return response.data
  },

  update: async (id: string, data: UpdateProductApiRequest): Promise<ApiProduct> => {
    const response = await apiClient.put<ApiProduct>(`/api/products/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`)
  },

  forceDelete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}/force`)
  },
}

export const categoryApi = {
  getAll: async (): Promise<ApiCategory[]> => {
    const response = await apiClient.get<ApiCategory[]>('/api/categories')
    return response.data
  },

  create: async (name: string): Promise<ApiCategory> => {
    const response = await apiClient.post<ApiCategory>('/api/categories', { name, parentId: null, icon: null })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`)
  },
}
