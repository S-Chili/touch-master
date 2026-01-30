import React, { useMemo, useEffect, useState } from "react";
import { useSettings } from "../../context/useSettings";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import useStats from "../../hooks/useStats";
import { computeAggregates, groupDailySeries, seriesBySession } from "../../data/statsStore";
import { loadLessonProgress, onLessonProgressUpdate } from "../../data/lessonProgressStore";
import { Link } from "react-router-dom";

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";
const NEO_PURPLE = "#8a2be2";

const IconChart = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={NEO_PINK}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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

function toPoints(series, width, height, pad = 10) {
  if (!series?.length) return "";

  const ys = series.map((p) => Number(p.y)).filter((n) => Number.isFinite(n));
  if (!ys.length) return "";

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const dy = maxY - minY || 1;

  const len = series.length;
  const dx = (width - pad * 2) / Math.max(1, len - 1);

  return series
    .map((p, i) => {
      const yVal = Number(p.y);
      const x = pad + i * dx;
      const y = height - pad - ((yVal - minY) / dy) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const Segmented = ({ value, onChange, options }) => (
  <div className="flex rounded-xl overflow-hidden border border-cyan-500/25 bg-black/40">
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-3 py-2 text-xs font-bold tracking-widest uppercase
            transition-all
            ${active ? "bg-cyan-500/15 text-cyan-200" : "text-gray-400 hover:bg-white/5"}
          `}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);


const MiniLineChart = ({ series, stroke = NEO_BLUE }) => {
  
  const w = 240;
  const h = 90;

  const safeSeries = useMemo(() => {
    const arr = Array.isArray(series) ? series : [];
    return arr
      .map((p) => ({ x: p.x, y: Number(p.y) }))
      .filter((p) => Number.isFinite(p.y));
  }, [series]);

  if (!safeSeries.length) {
    return (
      <div className="w-full h-24 rounded bg-linear-to-r from-cyan-500/6 to-pink-500/6 flex items-center justify-center text-xs text-gray-500">
        No data yet
      </div>
    );
  }

  if (safeSeries.length === 1) {
    const y = safeSeries[0].y;

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
        <text x="10" y="18" fontSize="10" fill="rgba(255,255,255,0.35)">
          1 day
        </text>

        <circle
          cx={w / 2}
          cy={h / 2}
          r="6"
          fill={stroke}
          opacity="0.95"
        />
        <text
          x={w / 2}
          y={h / 2 + 22}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.55)"
        >
          {Math.round(y)}
        </text>
      </svg>
    );
  }

   const points = toPoints(safeSeries, w, h, 10);
  if (!points) {
    return (
      <div className="w-full h-24 rounded bg-linear-to-r from-cyan-500/6 to-pink-500/6 flex items-center justify-center text-xs text-gray-500">
        No data yet
      </div>
    );
  }

  const lastPoint = points.split(" ").slice(-1)[0];
  const [lastX, lastY] = lastPoint.split(",");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
      <circle cx={lastX} cy={lastY} r="4" fill={stroke} />
    </svg>
  );
};

const StatsPanel = ({
  isUK,
  allAgg,
  lessonAgg,
  gameAgg,
  language,
  setLanguage,
  layout,
  setLayout,
  lastCompletedLessonId,
}) => {
  const level = Number.isFinite(lastCompletedLessonId) ? lastCompletedLessonId : 0;


  return (
    <div className="w-full rounded-xl p-4 bg-black/60 border border-cyan-600/30 backdrop-blur shadow-[0_0_20px_rgba(0,234,255,0.18)] mb-6">

      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {isUK ? "Мова інтерфейсу" : "UI language"}
          </div>

          <Segmented
            value={language}
            onChange={setLanguage}
            options={[
              { value: "uk", label: "UA" },
              { value: "en", label: "EN" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {isUK ? "Розкладка" : "Keyboard layout"}
          </div>

          <Segmented
            value={layout}
            onChange={setLayout}
            options={[
              { value: "en", label: "EN" },
              { value: "uk", label: "UK" },
            ]}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-pink-400 font-bold tracking-wider">
          {isUK ? "ВІТАЄМО" : "WELCOME BACK"}
        </div>

        <MiniIcon>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={NEO_BLUE}
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="4" />
          </svg>
        </MiniIcon>
      </div>

      <div className="text-sm text-cyan-200 space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-300">Level</span>
          <span className="font-semibold">{level}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">{isUK ? "Точність" : "Accuracy"}</span>
          <span className="font-semibold">
            {Number.isFinite(allAgg?.avgAccuracy) ? `${allAgg.avgAccuracy}%` : "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">{isUK ? "Швидкість" : "Speed"}</span>
          <span className="font-semibold">
            {Number.isFinite(allAgg?.avgWpm) ? `${allAgg.avgWpm} WPM` : "—"}
          </span>
        </div>

        <div className="pt-2 mt-2 border-t border-cyan-500/15 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>{isUK ? "Забіги" : "Runs"}</span>
            <span className="text-gray-300">
              {lessonAgg?.totalRuns ?? 0} L / {gameAgg?.totalRuns ?? 0} G
            </span>
          </div>

          <div className="flex justify-between">
            <span>{isUK ? "Кращий WPM" : "Best WPM"}</span>
            <span className="text-gray-300">{allAgg?.bestWpm ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const { language, setLanguage, layout, setLayout } = useSettings();
  const isUK = language === "uk";

  const { sessions } = useStats();

    const [lessonProgress, setLessonProgress] = useState(() => loadLessonProgress());

  useEffect(() => {
    const off = onLessonProgressUpdate(() => {
      setLessonProgress(loadLessonProgress());
    });

    const onFocus = () => setLessonProgress(loadLessonProgress());
    window.addEventListener("focus", onFocus);

    return () => {
      off?.();
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const lastCompletedLessonId = useMemo(() => {
    const completed = Array.isArray(lessonProgress?.completed)
      ? lessonProgress.completed
      : [];
    const nums = completed.map(Number).filter(Number.isFinite);
    return nums.length ? Math.max(...nums) : 0;
  }, [lessonProgress]);

  const safeSessions = useMemo(() => (Array.isArray(sessions) ? sessions : []), [sessions]);

  const lessonSessions = useMemo(
    () => safeSessions.filter((s) => s.mode === "lesson"),
    [safeSessions]
  );

  const gameSessions = useMemo(
    () => safeSessions.filter((s) => s.mode === "game"),
    [safeSessions]
  );

  const allAgg = useMemo(() => computeAggregates(safeSessions), [safeSessions]);
  const lessonAgg = useMemo(() => computeAggregates(lessonSessions), [lessonSessions]);
  const gameAgg = useMemo(() => computeAggregates(gameSessions), [gameSessions]);

  
 const wpmSeries = useMemo(() => {
  const days = new Set(
    safeSessions.map(s =>
      new Date(s.createdAt).toISOString().slice(0, 10)
    )
  );

  if (days.size <= 1) {
    return seriesBySession(safeSessions, "wpm").slice(-20);
  }

  return groupDailySeries(safeSessions, "wpm").slice(-14);
}, [safeSessions]);

  const streak = useMemo(() => {
    const days = new Set(
      safeSessions
        .map((s) => s.createdAt)
        .filter(Boolean)
        .map((ts) => new Date(ts).toISOString().slice(0, 10))
    );

    if (!days.size) return 0;

    let count = 0;
    let d = new Date();
    for (let i = 0; i < 365; i++) {
      const key = d.toISOString().slice(0, 10);
      if (!days.has(key)) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [safeSessions]);

  return (
    <div className="relative w-full min-h-screen text-cyan-300 font-mono px-2">
      <div className="absolute inset-0 opacity-6 bg-[linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,0,200,0.02)_1px,transparent_1px)] bg-size-[80px_80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[80%] lg:shrink-0">
          <section className="bg-black/40 border border-cyan-700/20 rounded-xl p-6 backdrop-blur shadow-[0_0_30px_rgba(0,234,255,0.06)] mb-6">
            <div className="mb-6">
              <NeonKeyboard showLabels={false} layout={layout} />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
              <div>{isUK ? "Режим: Українська (UKR)" : "Mode: English (ENG)"}</div>
              <div className="text-pink-400 font-semibold">Home row highlighted</div>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-6">
              <Link to="/dashboard/warmup" className="block">
                <SmallButton label={isUK ? "РОЗІГРІВ" : "QUICK WARM-UP"} color="cyan" />
              </Link>
              <Link to="/lessons" className="block">
                <SmallButton label={isUK ? "УРОКИ" : "LESSON PATH"} color="purple" />              
              </Link>
              <Link to="/dashboard/free-typing" className="block">
                <SmallButton label={isUK ? "ВІЛЬНИЙ РЕЖИМ" : "FREE TYPING MODE"} color="pink" />
              </Link>
            <Link to="/dashboard/about" className="block">
                <SmallButton label={isUK ? "ПРО НАС" : "ABOUT US"} color="cyan" />
              </Link>
              <SmallButton label={isUK ? "ТЕСТ" : "SPEED TEST"} color="pink" />
              <SmallButton label={isUK ? "ПОВТОР" : "REPEAT"} color="purple" />
            </div>
          </section>

          <footer className="w-full text-xs text-gray-500 mb-8 px-2 lg:px-0">
            <div>› System: posture check enabled</div>
            <div>› Next lesson: Level D — Symbols</div>
          </footer>
        </div>

        <div className="w-full lg:w-[20%] lg:shrink-0">
          <StatsPanel
            isUK={isUK}
            allAgg={allAgg}
            lessonAgg={lessonAgg}
            gameAgg={gameAgg}
            language={language}
            setLanguage={setLanguage}
            layout={layout}
            setLayout={setLayout}
            lastCompletedLessonId={lastCompletedLessonId}
          />
          <section className="grid grid-cols-1 gap-6 mb-12">
            <div className="bg-black/40 border border-cyan-700/20 rounded-xl p-4 shadow-[0_0_18px_rgba(0,234,255,0.04)]">
              <h3 className="text-cyan-300 text-lg mb-3 flex items-center gap-2">
                <IconChart /> Performance
                <span className="ml-auto text-[10px] text-gray-500">
                  avg {allAgg?.avgWpm ?? 0} wpm
                </span>
              </h3>

              <div className="w-full rounded bg-linear-to-r from-cyan-500/6 to-pink-500/6">
                <MiniLineChart series={wpmSeries} stroke={NEO_BLUE} />
              </div>
              <div className="mt-2 text-[11px] text-gray-500 flex justify-between">
                <span>last 14 days</span>
                <span>best: {allAgg?.bestWpm ?? 0}</span>
              </div>
            </div>

            <div className="bg-black/40 border border-cyan-700/20 rounded-xl p-4 shadow-[0_0_18px_rgba(0,234,255,0.04)]">
              <h4 className="text-pink-400 text-sm mb-2">Streak</h4>
              <div className="text-white text-2xl font-bold">{streak}</div>
              <div className="mt-4 text-sm text-gray-400">Consistency +{Math.min(10, streak * 2)}</div>
            </div>

            <div className="bg-black/40 border border-cyan-700/20 rounded-xl p-4 shadow-[0_0_18px_rgba(0,234,255,0.04)]">
              <h4 className="text-purple-300 text-sm mb-2">Split</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Lessons avg</span>
                  <span className="text-gray-300">{lessonAgg?.avgWpm ?? 0} wpm</span>
                </div>
                <div className="flex justify-between">
                  <span>Games avg</span>
                  <span className="text-gray-300">{gameAgg?.avgWpm ?? 0} wpm</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
