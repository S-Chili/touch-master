// src/pages/HomePage.jsx
import React from 'react';
import { useSettings } from '../../context/useSettings'; // 1. ІМПОРТ

const HomePage = () => {
  const { language, toggleLanguage } = useSettings();

  const content = {
    en: {
      title: "TOUCHMASTER",
      subtitle: "LEARN TO TYPE WITHOUT LOOKING AT THE KEYS",
      start: "Start Learning",
      howItWorks: "HOW IT WORKS",
    },
    uk: {
      title: "ТАЧМАСТЕР",
      subtitle: "НАВЧИСЯ ДРУКУВАТИ БЕЗ ПОГЛЯДУ НА КЛАВІАТУРУ",
      start: "Почати навчання",
      howItWorks: "ЯК ЦЕ ПРАЦЮЄ",
    },
  };

  const t = content[language]; // Обираємо контент залежно від мови

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      
      {/* КНОПКА ПЕРЕКЛЮЧЕННЯ */}
      <div className="text-right mb-4">
        <button 
          onClick={toggleLanguage} 
          className="text-sm px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          {language === 'en' ? 'UKR' : 'ENG'}
        </button>
      </div>

      <header className="text-center py-20">
        <h1 className="text-6xl font-extrabold text-cyan-400 mb-4">{t.title}</h1>
        <h2 className="text-xl text-pink-500 mb-8">{t.subtitle}</h2>
        
        {/* Адаптуйте під стиль кіберпанк */}
        <button className="px-8 py-3 text-lg font-bold border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition duration-300">
          {t.start}
        </button>
      </header>

      <section className="mt-20">
        <h3 className="text-center text-gray-400 text-lg mb-10">{t.howItWorks}</h3>
        {/* Тут можна розмістити Ваші 3 блоки: Lesson, Exercises, Progress */}
      </section>
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-pink-500 hover:bg-cyan-400">Tailwind працює!</h1>
    </div>
      
    </div>
  );
};

export default HomePage;