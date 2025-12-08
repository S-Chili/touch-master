// src/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/useSettings.js'; 

const navItems = [
    { path: '/dashboard', label_uk: 'КОМАНДНИЙ ЦЕНТР', label_en: 'DASHBOARD' },
    { path: '/lessons', label_uk: 'УРОКИ', label_en: 'LESSONS' },
    { path: '/games', label_uk: 'ІГРИ', label_en: 'GAMES' },
    { path: '/stats', label_uk: 'АНАЛІТИКА', label_en: 'STATISTICS' },
    { path: '/settings', label_uk: 'КОНФІГУРАЦІЯ', label_en: 'SETTINGS' },
];

const Sidebar = () => {
    const { language } = useSettings();
    const isUK = language === 'uk';
    
    // Стилі для кіберпанк-навігації
    const baseStyle = "block py-2 px-4 rounded-lg text-lg font-bold transition duration-200";
    const activeStyle = baseStyle + " text-gray-900 bg-cyan-400 shadow-lg shadow-cyan-500/50";
    const inactiveStyle = baseStyle + " text-gray-300 hover:text-cyan-400 hover:bg-gray-800";

    return (
        <aside className="w-64 bg-gray-950 p-6 flex flex-col border-r-2 border-cyan-700/50 shadow-2xl shadow-cyan-500/10">
            
            {/* Заголовок / Лого (Кіберпанк) */}
            <h2 className="text-3xl font-mono mb-10 text-pink-500 tracking-wider border-b-2 border-pink-500/30 pb-2">
                TOUCHMASTER
            </h2>
            
            {/* Навігація */}
            <nav className="space-y-4 flex-grow">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            isActive ? activeStyle : inactiveStyle
                        }
                    >
                        {isUK ? item.label_uk : item.label_en}
                    </NavLink>
                ))}
            </nav>

            {/* Футер / Інфо про користувача */}
            <div className="text-sm text-gray-500 pt-6 border-t border-gray-700/50">
                <p>User: Admin_01</p>
                <p>Status: ONLINE</p>
            </div>
        </aside>
    );
};

export default Sidebar;