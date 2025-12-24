import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const bgDark = 'bg-[var(--color-neo-dark)]';
  const NEO_BLUE = 'rgb(0, 234, 255)'; 
  const NEO_PINK = 'rgb(255, 0, 230)'; 

  const HowItWorksIcons = {
    Lesson: (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
    className="mx-auto mb-4 opacity-100 transition-all duration-300"
    stroke={NEO_BLUE} strokeWidth="1" strokeLinecap="round">

    <rect x="5" y="3" width="14" height="18" rx="1.5" />

    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="14" y2="15" />

    <line x1="5" y1="3" x2="5" y2="21" strokeDasharray="2 3" />
  </svg>
),
    Exercises: (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
    className="mx-auto mb-4 opacity-100 transition-all duration-300"
    stroke={NEO_BLUE} strokeWidth="1" strokeLinecap="round">
    <rect x="3" y="6" width="18" height="12" rx="2" />    
    <rect x="5" y="8" width="2.2" height="1.4" rx="0.3" />
    <rect x="8" y="8" width="2.2" height="1.4" rx="0.3" />
    <rect x="11" y="8" width="2.2" height="1.4" rx="0.3" />
    <rect x="14" y="8" width="3.5" height="1.4" rx="0.3" />
    <rect x="5" y="11" width="3" height="1.4" rx="0.3" />
    <rect x="9" y="11" width="3" height="1.4" rx="0.3" />
    <rect x="13" y="11" width="3" height="1.4" rx="0.3" />
    <rect x="7" y="14" width="10" height="1.4" rx="0.3" />
  </svg>),
    Progress: (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
    className="mx-auto mb-4 opacity-100 transition-all duration-300"
    stroke={NEO_BLUE} strokeWidth="1" strokeLinecap="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="6" y="14" width="2" height="4" rx="0.5" />
    <rect x="10" y="10" width="2" height="8" rx="0.5" />
    <rect x="14" y="12" width="2" height="6" rx="0.5" />
    <path d="M6 15 L10 10 L14 12 L18 8" strokeLinejoin="round" />
  </svg>
)

  };

  const howItWorksData = [
    {
      title: "Lesson",
      description: "Step-by-step lessons for all skill levels",
      icon: HowItWorksIcons.Lesson
    },
    {
      title: "Exercises",
      description: "Practics with words, sentences, and code", 
      icon: HowItWorksIcons.Exercises
    },
    {
      title: "Progress",
      description: "Track your speed and accuracy",
      icon: HowItWorksIcons.Progress
    },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${bgDark} text-white flex flex-col`}>
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,0,200,0.35),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.2)_0px,rgba(255,255,255,0.2)_1px,transparent_1px,transparent_3px)]"></div>
      <div
        className="absolute inset-0 pointer-events-none 
        bg-[linear-gradient(90deg,rgba(0,255,255,0.12)_1px,transparent_1px),
             linear-gradient(rgba(255,0,230,0.12)_1px,transparent_1px)]
        bg-size-[55px_55px]"
      ></div>
      <nav className={`w-full flex justify-end gap-4 p-6 z-20 backdrop-blur-sm bg-white/5 border-b border-(--color-neo-blue)/40 shadow-[0_0_10px_rgba(0,234,255,0.2)]`}>
        <button className={`px-6 py-2 border border-(--color-neo-pink) text-(--color-neo-pink) rounded-md shadow-[0_0_5px_var(--color-neo-pink)aa] hover:bg-(--color-neo-pink) hover:text-(--color-neo-dark) transition-all duration-300`}>
          Log in
        </button>

        <button className={`px-6 py-2 border border-(--color-neo-blue) text-(--color-neo-blue) rounded-md shadow-[0_0_5px_var(--color-neo-blue)aa] hover:bg-(--color-neo-blue) hover:text-(--color-neo-dark) transition-all duration-300`}>
          Sign up
        </button>
      </nav>

      <header className="flex flex-col items-center justify-center grow text-center px-6 z-10 select-none">
        <h1 className={`relative text-7xl sm:text-8xl font-extrabold text-(--color-neo-blue) drop-shadow-[0_0_5px_var(--color-neo-pink)aa] glitch`}>TOUCHMASTER</h1>
        <style>
          {`
            .glitch {
              position: relative;
            }
            .glitch::before,
            .glitch::after {
              content: "TOUCHMASTER";
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              opacity: 0.6;
            }
            .glitch::before {
              color: var(--color-neo-pink);
              transform: translate(3px, -2px);
              animation: glitch1 1.7s infinite;
            }
            .glitch::after {
              color: var(--color-neo-blue);
              transform: translate(-3px, 2px);
              animation: glitch2 1.3s infinite;
            }

            @keyframes glitch1 {
              0% { transform: translate(0, 0); }
              25% { transform: translate(2px, -2px); }
              50% { transform: translate(0, 0); }
              75% { transform: translate(-2px, 2px); }
              100% { transform: translate(0, 0); }
            }

            @keyframes glitch2 {
              0% { transform: translate(0, 0); }
              25% { transform: translate(-3px, 1px); }
              50% { transform: translate(0, 0); }
              75% { transform: translate(3px, -1px); }
              100% { transform: translate(0, 0); }
            }
         `}
        </style>

        <h2 className={`mt-4 text-xl sm:text-2xl text-(--color-neo-pink) tracking-widest opacity-80`}>
          LEARN TO TYPE WITHOUT LOOKING AT THE KEYS
        </h2>
        <Link
          to="/dashboard"
          className={`mt-12 px-12 py-4 text-2xl font-bold border-2 border-(--color-neo-blue) text-(--color-neo-blue) 
          rounded-lg shadow-[0_0_10px_var(--color-neo-blue)aa] hover:bg-(--color-neo-blue) hover:text-(--color-neo-dark) transition-all duration-300`}
        >
          Start Learning
        </Link>
      </header>
      <section className="py-20 z-10">
        <h3 className="text-center text-(--color-neo-pink) text-3xl mb-12 tracking-wider font-extrabold">
          HOW IT WORKS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">

          {howItWorksData.map((item, i) => (
            <div
              key={i}
              className={`
                group relative p-8 rounded-lg overflow-hidden cursor-pointer h-full
                flex flex-col items-center text-center
                bg-transparent 
                shadow-[0_10px_10px_-5px_rgba(0,234,255,0.1),0_0_5px_rgba(0,234,255,0.2)] 
                hover:shadow-[0_15px_15px_-5px_rgba(0,234,255,0.4),0_0_10px_rgba(0,234,255,0.5)]
                transition-all duration-300
              `}
            >
              <div className="relative z-10">
                
                {item.icon} 

                <h4 className="text-xl font-semibold text-(--color-neo-blue) tracking-wide mt-2">
                  {item.title}
                </h4>
                
                <span className={`mt-1 text-sm text-(--color-neo-blue) opacity-90`}>
                  {item.description}
                </span>
              </div>
            </div>
          ))}

        </div>
      </section>


    </div>
  );
}