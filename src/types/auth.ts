import type { User } from '@/types'

// AuthContext.tsx 跟身分認證相關的介面
export interface AuthContextValue {
    user: User | null        // null 代表未登入
    isLoading: boolean       // true 僅於初始 /manage/info 檢查期間
    login: (user: User) => void
    logout: () => Promise<void>
    refreshUser: () => Promise<void> // 讓註冊/登入後可以主動重新取得使用者資訊
}

// auth.ts 跟身分認證相關的 API 請求與資料結構
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