// src/pages/Dashboard.jsx
import React from 'react';
import { useSettings } from '../../context/useSettings'; // Використовуємо наш хук

const Dashboard = () => {
    const { language } = useSettings();
    const isUK = language === 'uk';

    return (
        <div className="p-8">
            <h1 className="text-4xl text-yellow-400">
                {isUK ? 'Панель Керування (Dashboard)' : 'Dashboard'}
            </h1>
            <p className="text-gray-400 mt-4">
                {isUK ? 'Тут буде аналітика, уроки та статистика.' : 'Analytics, lessons, and statistics will go here.'}
            </p>
        </div>
    );
};

export default Dashboard;