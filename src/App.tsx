// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/Layout/AuthLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ItemDetail from './pages/ItemDetail';
import Reminders from './pages/Reminders';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import Register from './pages/Register';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公開首頁 */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 需要登入的頁面（目前模擬全部開放） */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<ItemDetail />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/settings" element={<Settings />} />

          {/* 預設 404 跳轉到 dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;