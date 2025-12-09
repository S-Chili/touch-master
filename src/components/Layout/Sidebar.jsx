import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/useSettings.js';

const IconLogout = () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="neon-icon">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

const icons = {
    dashboard: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="neon-icon">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="12" y="3" width="7" height="4" rx="1" />
            <rect x="12" y="9" width="7" height="7" rx="1" />
            <rect x="3" y="12" width="7" height="4" rx="1" />
        </svg>
    ),

    lessons: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="neon-icon">
            <path d="M4 5h14M4 11h14M4 17h14" />
        </svg>
    ),

    games: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="neon-icon">
            <rect x="3" y="7" width="16" height="10" rx="2" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="14" cy="12" r="1.5" />
        </svg>
    ),

    stats: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="neon-icon">
            <path d="M5 15V9M11 15V5M17 15V11" />
        </svg>
    ),
    
    logout: <IconLogout />,
};

const navItems = [
    { path: '/dashboard', icon: icons.dashboard, label_uk: 'КОМАНДНИЙ ЦЕНТР', label_en: 'DASHBOARD' },
    { path: '/lessons',   icon: icons.lessons,   label_uk: 'УРОКИ', label_en: 'LESSONS' },
    { path: '/games',     icon: icons.games,     label_uk: 'ІГРИ', label_en: 'GAMES' },
    { path: '/stats',     icon: icons.stats,     label_uk: 'АНАЛІТИКА', label_en: 'STATISTICS' },
    { path: '/',          icon: icons.logout,    label_uk: 'ВИХІД', label_en: 'LOGOUT', isLogout: true }, 
];

const Sidebar = () => {
    const { language } = useSettings();
    const isUK = language === 'uk';

    const baseStyle =
        "flex items-center gap-3 py-3 px-4 text-lg font-semibold rounded-lg transition-all duration-200";

    const activeStyle =
        baseStyle +
        " text-cyan-300 bg-cyan-900/20 shadow-[0_0_12px_rgba(0,255,255,0.5)] backdrop-blur-sm border border-cyan-500/40";

    const inactiveStyle =
        baseStyle +
        " text-gray-400 hover:text-cyan-300 hover:bg-gray-900/40 hover:border-cyan-500/20 border border-transparent";
        
    const logoutStyle =
        baseStyle +
        " text-pink-500 hover:text-pink-300 hover:bg-gray-900/40 border border-transparent mt-auto"; // mt-auto прикріпить до низу

    return (
        <aside className="w-64 bg-black/90 p-6 flex flex-col border-r border-cyan-500/30 shadow-2xl shadow-cyan-500/10 h-screen"> {/* Додано h-screen для фіксації */}

            <h2 className="text-3xl font-mono font-bold mb-6 text-pink-500 tracking-widest">
                TOUCHMASTER
            </h2>

            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-8 shadow-[0_0_12px_rgba(0,255,255,0.8)]"></div>

            <nav className="space-y-4 flex-grow">
                {navItems.map((item) => {
                    if (item.isLogout) {
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path} 
                                className={logoutStyle} 
                            >
                                <span className="text-pink-500">{item.icon}</span>
                                {isUK ? item.label_uk : item.label_en}
                            </NavLink>
                        );
                    }
                    
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? activeStyle : inactiveStyle
                            }
                        >
                            <span className="text-cyan-300">{item.icon}</span>
                            {isUK ? item.label_uk : item.label_en}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;