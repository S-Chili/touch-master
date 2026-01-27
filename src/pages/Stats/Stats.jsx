import React, { useMemo, useCallback } from "react";
import useStats from "../../hooks/useStats";
import { useSettings } from "../../context/useSettings";
import {
  computeAggregates,
  seriesBySession,
  clearSessions,
} from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";
const NEO_PURPLE = "#8a2be2";
const NEO_DARK = "#0a0c11";

const IconChart = ({ color }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 17 8 12 13 15 19 8" />
    <polyline points="15 8 19 8 19 12" />
  </svg>
);

const StatMetricCard = ({ title, value, unit, color }) => (
  <div
    className="
      p-6 rounded-xl transition-all duration-300
      bg-black/40 backdrop-blur-sm border
      shadow-[0_0_15px_rgba(0,0,0,0.25)]
      hover:shadow-[0_0_25px_rgba(0,0,0,0.35)]
    "
    style={{
      borderColor: `${color}66`,
      boxShadow: `0 0 18px ${color}22`,
    }}
  >
    <div
      className="text-sm font-semibold tracking-wider uppercase mb-1"
      style={{ color }}
    >
      {title}
    </div>

    <div className="text-5xl font-extrabold text-white">
      {value}
      <span className="text-xl font-normal ml-2 text-gray-400">{unit}</span>
    </div>
  </div>
);

function mapToScreenPoints(series, width, height, pad = 18) {
  if (!series?.length) return [];

  const xs = series.map((p) => p.x);
  const ys = series.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const dx = maxX - minX || 1;
  const dy = maxY - minY || 1;

  return series.map((p) => {
    const x = pad + ((p.x - minX) / dx) * (width - pad * 2);
    const y = height - pad - ((p.y - minY) / dy) * (height - pad * 2);
    return { x, y, v: p.y };
  });
}

function LineChartMini({ title, color, series, height = 320, emptyText }) {
  const w = 900;
  const h = height;

  const screen = useMemo(() => mapToScreenPoints(series, w, h), [series, h]);
  const points = useMemo(
    () => screen.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
    [screen]
  );

  const last = useMemo(() => {
    if (!series?.length) return 0;
    const v = series[series.length - 1].y;
    return Number.isFinite(v) ? v : 0;
  }, [series]);

  return (
    <div
      className="w-full p-4 rounded-xl bg-black/50 backdrop-blur-sm border"
      style={{ borderColor: `${color}55`, boxShadow: `0 0 20px ${color}1a` }}
    >
      <h3
        className="text-lg font-semibold mb-3 flex items-center gap-2"
        style={{ color }}
      >
        <IconChart color={color} /> {title}
        <span className="ml-auto text-xs text-gray-400">
          last: {Math.round(last)}
        </span>
      </h3>

      {!screen.length ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          {emptyText}
        </div>
      ) : (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-80">
          <g opacity="0.25">
            {[0.25, 0.5, 0.75].map((t, i) => (
              <line
                key={i}
                x1="0"
                x2={w}
                y1={h * t}
                y2={h * t}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </g>

          <polyline
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />

          {screen.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={color}
              opacity={i === screen.length - 1 ? 1 : 0.55}
            />
          ))}
        </svg>
      )}
    </div>
  );
}

export default function Stats() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const t = useMemo(
    () => ({
      title: isUK ? "АНАЛІЗ ПРОДУКТИВНОСТІ" : "PERFORMANCE ANALYSIS",
      reset: isUK ? "Скинути статистику" : "Reset Stats",

      confirmReset: isUK
        ? "Скинути всю статистику? Це видалить всі сесії без можливості відновлення."
        : "Reset all stats? This will delete all sessions and cannot be undone.",

      avgSpeedAll: isUK ? "Середня швидкість (всього)" : "Average Speed (All)",
      avgAccAll: isUK ? "Середня точність (всього)" : "Average Accuracy (All)",
      bestWpmAll: isUK ? "Найкращий WPM (всього)" : "Best WPM (All)",
      totalRunsAll: isUK ? "Всього спроб (всього)" : "Total Runs (All)",
      runsSplit: isUK ? "Розподіл спроб" : "Runs Split",

      wpmChart: isUK ? "Прогрес WPM з часом" : "WPM Progression Over Time",
      accChart: isUK ? "Тренд точності" : "Accuracy Trends",

      emptyChart: isUK
        ? "Ще немає даних (зіграй урок/гру, щоб зʼявились сесії)"
        : "No data yet (play a lesson/game to generate sessions)",

      runsUnit: isUK ? "спроб" : "runs",
      splitUnit: isUK ? "уроки/ігри" : "lessons/games",
    }),
    [isUK]
  );

  const { sessions } = useStats();

  const lessonSessions = useMemo(
    () => (sessions ?? []).filter((s) => s.mode === "lesson"),
    [sessions]
  );

  const gameSessions = useMemo(
    () => (sessions ?? []).filter((s) => s.mode === "game"),
    [sessions]
  );

  const allAgg = useMemo(() => computeAggregates(sessions ?? []), [sessions]);
  const lessonAgg = useMemo(
    () => computeAggregates(lessonSessions),
    [lessonSessions]
  );
  const gameAgg = useMemo(() => computeAggregates(gameSessions), [gameSessions]);

  const wpmSeries = useMemo(
    () => seriesBySession(sessions ?? [], "wpm"),
    [sessions]
  );
  const accSeries = useMemo(
    () => seriesBySession(sessions ?? [], "accuracy"),
    [sessions]
  );

  const onResetStats = useCallback(() => {
    const ok = window.confirm(t.confirmReset);
    if (!ok) return;

    clearSessions();
    emitStatsUpdate();
  }, [t.confirmReset]);

  return (
    <div
      className="relative w-full min-h-screen p-8 text-cyan-300 font-mono"
      style={{ backgroundColor: NEO_DARK }}
    >
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold text-white tracking-wider">
          {t.title}
        </h1>

        <button
          onClick={onResetStats}
          className="
            px-4 py-2 rounded-lg font-bold
            border border-red-500/50 text-red-300
            hover:bg-red-500/10 transition
            shadow-[0_0_18px_rgba(255,0,80,0.12)]
          "
        >
          {t.reset}
        </button>
      </div>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="col-span-2">
          <StatMetricCard
            title={t.avgSpeedAll}
            value={allAgg.avgWpm}
            unit="WPM"
            color={NEO_BLUE}
          />
        </div>

        <div className="col-span-2">
          <StatMetricCard
            title={t.avgAccAll}
            value={allAgg.avgAccuracy}
            unit="%"
            color={NEO_PINK}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="col-span-2">
          <LineChartMini
            title={t.wpmChart}
            color={NEO_BLUE}
            series={wpmSeries}
            height={320}
            emptyText={t.emptyChart}
          />
        </div>

        <LineChartMini
          title={t.accChart}
          color={NEO_PINK}
          series={accSeries}
          height={320}
          emptyText={t.emptyChart}
        />
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatMetricCard
          title={t.bestWpmAll}
          value={allAgg.bestWpm}
          unit="WPM"
          color={NEO_PURPLE}
        />

        <StatMetricCard
          title={t.totalRunsAll}
          value={allAgg.totalRuns}
          unit={t.runsUnit}
          color={NEO_BLUE}
        />

        <StatMetricCard
          title={t.runsSplit}
          value={`${lessonAgg.totalRuns} / ${gameAgg.totalRuns}`}
          unit={t.splitUnit}
          color={NEO_PINK}
        />
      </section>
    </div>
  );
}
