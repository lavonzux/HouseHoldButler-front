// ============================================
// main.tsx - 應用程式入口
// ============================================
// 
// 這是 Vite + React + TypeScript 專案的入口檔案
// 負責將 App 元件渲染到 DOM 中
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 取得 root 元素
// 使用非空斷言 (!) 因為我們確定 index.html 中有這個元素
const rootElement = document.getElementById('root')!;

// 建立 React root 並渲染
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
