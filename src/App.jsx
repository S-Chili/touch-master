// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Імпорт Компонентів (Вам потрібно буде їх створити/оновити)
import HomePage from './pages/Home/Home.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx'; // Створимо пізніше
import Layout from './components/Layout/Layout.jsx'; // Компонент обгортки (Header/Sidebar)

function App() {
  return (
    <Routes>
      {/* МАРШРУТ ДО ВХОДУ (ЛЕНДІНГ/РЕЄСТРАЦІЯ)
        Відображає тільки HomePage, без Sidebar чи Layout
      */}
      <Route path="/" element={<HomePage />} />
      
      {/* МАРШРУТИ ПІСЛЯ ВХОДУ (DASHBOARD та інше)
        Використовуємо компонент Layout як спільну обгортку (Header + Sidebar)
      */}
      <Route path="/" element={<Layout />}>
        {/* /dashboard відобразиться всередині <Outlet /> у Layout.jsx */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Тут будуть інші маршрути: /lessons, /statistics, /games */}
      </Route>
      
      {/* Маршрут 404 (Не знайдено) */}
      <Route path="*" element={<h1>404: Not Found (Спробуйте / або /dashboard)</h1>} />
      
    </Routes>
  );
}

export default App;