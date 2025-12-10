// src/pages/Dashboard.jsx
import React from "react";
import { useSettings } from "../../context/useSettings";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";
const NEO_PURPLE = "#8a2be2";

const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NEO_PINK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 17 8 12 13 15 19 8"></polyline>
  </svg>
);

const MiniIcon = ({ children }) => (
  <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-black/30 border border-neoBlue/20">
    {children}
  </span>
);

const SmallButton = ({ label, color = "cyan" }) => {
  const colorStyles =
    color === "cyan"
      ? {
          border: "border-[#59e9ff]",
          text: "text-[#59e9ff]",
          glow: "shadow-[0_0_25px_#59e9ff80]",
          hover: "hover:bg-[#59e9ff15]",
        }
      : color === "pink"
      ? {
          border: "border-[#ff6fae]",
          text: "text-[#ff6fae]",
          glow: "shadow-[0_0_25px_#ff6fae80]",
          hover: "hover:bg-[#ff6fae15]",
        }
      : {
          border: "border-[#c275ff]",
          text: "text-[#c275ff]",
          glow: "shadow-[0_0_25px_#c275ff80]",
          hover: "hover:bg-[#c275ff15]",
        };

  return (
    <button
      className={`
        w-full h-[90px] 
        rounded-xl
        border-2
        ${colorStyles.border}
        ${colorStyles.text}
        ${colorStyles.glow}
        ${colorStyles.hover}
        transition-all duration-200
        flex items-center justify-center
        text-xl font-semibold tracking-wider
        uppercase
        backdrop-blur-sm
        active:scale-95
        bg-white/0
      `}
    >
      {label}
    </button>
  );
};

const StatsPanel = ({ isUK }) => (
  <div className="w-full rounded-xl p-4 bg-black/60 border border-cyan-600/30 backdrop-blur shadow-[0_0_20px_rgba(0,234,255,0.18)] mb-6">
    <div className="flex items-center justify-between mb-3">
      <div className="text-xs text-pink-400 font-bold tracking-wider">{isUK ? "ВІТАЄМО" : "WELCOME BACK"}</div>
      <MiniIcon>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NEO_BLUE} strokeWidth="1.5"><circle cx="12" cy="12" r="4" /></svg>
      </MiniIcon>
    </div>

    <div className="text-sm text-cyan-200 space-y-1">
      <div className="flex justify-between"><span className="text-gray-300">Level</span><span className="font-semibold">7</span></div>
      <div className="flex justify-between"><span className="text-gray-300">Accuracy</span><span className="font-semibold">92%</span></div>
      <div className="flex justify-between"><span className="text-gray-300">Speed</span><span className="font-semibold">52 WPM</span></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { language } = useSettings();
  const isUK = language === "uk";

  return (
    <div className="relative w-full min-h-screen text-cyan-300 font-mono px-2">

      <div className="absolute inset-0 opacity-6 bg-[linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,0,200,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-[80%] lg:flex-shrink-0">
          
          <section className="bg-black/40 border border-cyan-700/20 rounded-xl p-6 backdrop-blur shadow-[0_0_30px_rgba(0,234,255,0.06)] mb-6">
            <div className="mb-6">
              <NeonKeyboard showLabels={false}/>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
              <div>{isUK ? "Режим: Українська (UKR)" : "Mode: English (ENG)"}</div>
              <div className="text-pink-400 font-semibold">Home row highlighted</div>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-6">
              <SmallButton label={isUK ? "РОЗІГРІВ" : "QUICK WARM-UP"} color="cyan" />
              <SmallButton label={isUK ? "УРОКИ" : "LESSON PATH"} color="purple" />
              <SmallButton label={isUK ? "ВІЛЬНИЙ РЕЖИМ" : "FREE TYPING MODE"} color="pink" />

              <SmallButton label={isUK ? "CODING" : "CODING MODE"} color="cyan" />
              <SmallButton label={isUK ? "ТЕСТ" : "SPEED TEST"} color="pink" />
              <SmallButton label={isUK ? "ПОВТОР" : "REPEAT"} color="purple" />
            </div>
          </section>

          <footer className="w-full text-xs text-gray-500 mb-8 px-2 lg:px-0">
            <div>› System: posture check enabled</div>
            <div>› Next lesson: Level D — Symbols</div>
          </footer>
        </div>

        <div className="w-full lg:w-[20%] lg:flex-shrink-0">
          
          <StatsPanel isUK={isUK} />

          <section className="grid grid-cols-1 gap-6 mb-12">
            
            <div className="bg-black/40 border border-cyan-700/20 rounded-xl p-4 shadow-[0_0_18px_rgba(0,234,255,0.04)]">
              <h3 className="text-cyan-300 text-lg mb-3 flex items-center gap-2"><IconChart /> Performance</h3>
              <div className="w-full h-36 bg-gradient-to-r from-cyan-500/6 to-pink-500/6 rounded"></div>
            </div>

            <div className="bg-black/40 border border-cyan-700/20 rounded-xl p-4 shadow-[0_0_18px_rgba(0,234,255,0.04)]">
              <h4 className="text-pink-400 text-sm mb-2">Streak</h4>
              <div className="text-white text-2xl font-bold">4</div>
              <div className="mt-4 text-sm text-gray-400">Consistency +10</div>
            </div>
          </section>
        </div>

      </div> 

    </div>
  );
};

export default Dashboard;