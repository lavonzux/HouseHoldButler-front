// src/components/Layout/RequireAuth.tsx
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuth } from '@/context/AuthContext'

const RequireAuth: React.FC = () => {
    const { user, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!user) {
        // 將使用者原本欲前往的路徑存入 state，登入後可導回
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />
}

export default RequireAuth
