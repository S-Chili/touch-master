// src/Layout/Layout.jsx - Оновлення
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx'; // 1. ІМПОРТ

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      
      {/* 2. Інтеграція Sidebar */}
      <Sidebar />

      {/* Основний вміст сторінки (буде займати решту місця) */}
      <main className="flex-grow p-8">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;