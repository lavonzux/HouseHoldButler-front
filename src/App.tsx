// src/App.tsx
import React, {useEffect} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthLayout from '@components/Layout/AuthLayout';
import RequireAuth from '@components/Layout/RequireAuth';
import Landing from '@pages/Landing';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import Inventory from '@pages/Inventory';
import ItemDetail from '@pages/ItemDetail';
import Reminders from '@pages/Reminders';
import Budget from '@pages/Budget';
import Settings from '@pages/Settings';
import Register from '@pages/Register';
import NotFound from '@pages/NotFound';

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }, [location.pathname]); // 每次路徑改變時執行

  return (
      <Routes>
        {/* 公開首頁 */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 需要登入的頁面 */}
        <Route element={<RequireAuth />}>
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<ItemDetail />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        {/* 明確的 404 頁面路由 */}
        <Route path="/notFound" element={<NotFound />} />

        {/* 所有未匹配路由 → 導向 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default App;