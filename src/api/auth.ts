import apiClient from './client'

export interface LoginRequest {
    email: string
    password: string
    rememberMe: boolean
}

export const authApi = {
    login: async (data: LoginRequest): Promise<void> => {
        await apiClient.post('/api/auth/login', data)
        // 不需要處理 token，Cookie 由瀏覽器自動儲存
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/api/auth/logout')
        // Cookie 由後端清除，前端不需要動 localStorage
    },
}