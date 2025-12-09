import React from 'react';

const NEO_BLUE = '#00eaff'; 
const NEO_PINK = '#ff00e6'; 
const NEO_DARK = '#0a0c11'; 

const IconBook = () => (
   <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
    className="mx-auto mb-4 opacity-100 transition-all duration-300"
    stroke={NEO_BLUE} strokeWidth="1" strokeLinecap="round">

    <rect x="5" y="3" width="14" height="18" rx="1.5" />

    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="14" y2="15" />

    <line x1="5" y1="3" x2="5" y2="21" strokeDasharray="2 3" />
  </svg>
);

const CurrentLessonCard = ({ lessonNumber, title }) => (
    <div 
        className={`
            w-full max-w-lg mx-auto p-8 rounded-2xl border-2 
            border-[${NEO_BLUE}] bg-black/50 shadow-[0_0_30px_rgba(0,234,255,0.4)]
            text-center
        `}
    >
        <div className="flex justify-center mb-4">
            <IconBook />
        </div>
        <div className="text-xl font-bold tracking-widest text-white mb-1">
            STEP {lessonNumber}
        </div>
        <h2 className="text-4xl font-extrabold text-[${NEO_PINK}] drop-shadow-[0_0_5px_rgba(255,0,230,0.5)]">
            {title}
        </h2>
    </div>
);

const LessonItem = ({ number, title, isCompleted }) => {
    const statusClass = isCompleted
        ? "opacity-40 border-gray-700/50 bg-black/30 hover:shadow-none cursor-default"
        : `
          opacity-100 border-[${NEO_BLUE}] hover:border-white 
          shadow-[0_0_15px_rgba(0,234,255,0.15)] 
          hover:shadow-[0_0_25px_rgba(0,234,255,0.5)] 
          cursor-pointer
        `;

    const icon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 6L9 17L4 12" /></svg> 
    );
  
    return (
        <div 
            className={`
                p-4 rounded-xl border transition-all duration-300
                flex items-center space-x-4
                ${statusClass}
            `}
        >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 border border-current text-white text-sm font-bold">
                {isCompleted ? icon : number} 
            </div>
            <div>
                <div className="text-xs text-gray-400">Lesson {number}</div>
                <div className={`text-md font-semibold ${isCompleted ? 'text-gray-500' : 'text-white'}`}>
                    {title}
                </div>
            </div>
        </div>
    );
};

const Lessons = () => {
    const lessonsData = [
        { number: 1, title: 'Home Row Mastery', isCompleted: true },
        { number: 2, title: 'E and I Keys', isCompleted: true },
        { number: 3, title: 'T, R, and O Keys', isCompleted: true },
        { number: 4, title: 'W and P Keys', isCompleted: false }, 
        { number: 5, title: 'Shift and Capitals', isCompleted: false },
        { number: 6, title: 'Numbers (Top Row)', isCompleted: false },
        { number: 7, title: 'Symbols (Basic)', isCompleted: false },
        { number: 8, title: 'Punctuation', isCompleted: false },
        { number: 9, title: 'Advanced Symbols', isCompleted: false },
        { number: 10, title: 'Final Test', isCompleted: false },
    ];

  const currentLesson = lessonsData.find(l => l.number === 4);

    return (
        <div className={`relative w-full min-h-screen p-8 text-cyan-300 font-mono bg-[${NEO_DARK}]`}>
            
            <h1 className="text-4xl font-extrabold text-white mb-10 tracking-wider text-center">
                TYPING PATH
            </h1>
            
            <div className="flex flex-col items-center justify-center mb-10">
                
                {currentLesson && (
                    <CurrentLessonCard 
                        lessonNumber={currentLesson.number}
                        title={currentLesson.title}
                    />
                )}
                
                <button
                    className={`
                        mt-8 px-10 py-3 text-xl font-bold rounded-lg
                        border-2 border-[${NEO_BLUE}] text-[${NEO_BLUE}] 
                        shadow-[0_0_15px_rgba(0,234,255,0.6)] 
                        hover:bg-[${NEO_BLUE}] hover:text-black 
                        transition-all duration-300 active:scale-95
                    `}
                >
                    Continue Training
                </button>

            </div>

            <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-400 mb-6 border-b border-gray-700/50 pb-2">
                    Lesson Path Overview
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {lessonsData.map((lesson) => (
                        <LessonItem 
                            key={lesson.number}
                            number={lesson.number}
                            title={lesson.title}
                            isCompleted={lesson.isCompleted}
                        />
                    ))}

                </div>
            </div>
            
        </div>
    );
};

export default Lessons;