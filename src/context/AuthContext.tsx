// src/context/AuthContext.tsx
import React, {
    createContext, useContext, useState,
    useEffect, useCallback, useRef,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@api/auth'
import type { User } from '@/types'
import type { AuthContextValue } from '@/types/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    // 追蹤初始載入是否完成，避免初始 getMe 產生的 401 事件觸發跳轉
    const initialLoadDone = useRef(false)

    const refreshUser = useCallback(async () => {
        setIsLoading(true)
        try {
            const fetchedUser = await authApi.getMe()
            setUser(fetchedUser)
        } catch (err) {
            setUser(null) // 不主動跳轉，讓路由守衛處理
        } finally {
            setIsLoading(false)
        }
    }, [])

    // 應用程式啟動時檢查 session 是否有效
    // useEffect(() => {
    //     authApi.getMe().then((fetchedUser) => {
    //         setUser(fetchedUser)
    //         initialLoadDone.current = true
    //         setIsLoading(false)
    //     })
    // }, [])

    useEffect(() => {
        refreshUser().finally(() => {
            initialLoadDone.current = true
        })
    }, [refreshUser])

    // 監聽 Axios 攔截器發出的 401 事件（session 中途過期）
    useEffect(() => {
        const handleUnauthorized = () => {
            // 忽略初始 getMe 呼叫期間產生的 401
            if (!initialLoadDone.current) return
            setUser(null)
            navigate('/login', { replace: true })
        }

        window.addEventListener('auth:unauthorized', handleUnauthorized)
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized)
        }
    }, [navigate])

    const login = useCallback((fetchedUser: User) => {
        setUser(fetchedUser)
    }, [])

    const logout = useCallback(async () => {
        try {
            await authApi.logout()
        } catch (err) {
            console.warn('後端登出 API 呼叫失敗，但仍執行前端登出流程', err);
        }
        // 不論後端是否成功，都強制清除前端狀態並跳轉
        setUser(null)
        navigate('/login', { replace: true })
    }, [navigate])    

    return (
        <AuthContext.Provider 
            value={{ 
                user,
                isLoading,
                login,
                logout,
                refreshUser 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
