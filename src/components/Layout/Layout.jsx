// src/Layout/Layout.jsx - Оновлення
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx'; 

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
      
      <Sidebar />
      <main className="grow p-8 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;