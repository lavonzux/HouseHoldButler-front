import apiClient from '@api/client'
import type { User } from '@/types'

export interface LoginRequest {
    email: string
    password: string
    rememberMe: boolean
}

export interface RegisterRequest {
    email: string
    password: string
    name: string
    phone: string
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    resetCode: string;
    newPassword: string;
}

export const authApi = {
    register: async (data: RegisterRequest): Promise<void> => {
        await apiClient.post('/api/Auth/register', data);
    },

    login: async (data: LoginRequest): Promise<void> => {
        await apiClient.post('/login?useCookies=true', data)
        // 不需要處理 token，Cookie 由瀏覽器自動儲存
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/logout')
        // Cookie 由後端清除，前端不需要動 localStorage
    },

    getMe: async (): Promise<User | null> => {
        try {
            const response = await apiClient.get<User>('/manage/info')
            return response.data
        } catch {
            // 401 或任何網路錯誤都視為未登入，不拋出例外
            return null
        }
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
        // 成功只回應 200，無 body，不需要 return
        await apiClient.post('/api/Auth/forgotPassword', data);
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
        await apiClient.post('/api/Auth/resetPassword', data);
    }
}