import React, { useMemo } from "react";
import useStats from "../../hooks/useStats";
import { computeAggregates, groupDailySeries } from "../../data/statsStore";

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

const ChartPlaceholder = ({ title, color, height = "h-64" }) => {
  const gradientStops =
    color === NEO_BLUE
      ? "from-cyan-700/5 to-cyan-400/20"
      : color === NEO_PINK
      ? "from-pink-700/5 to-pink-400/20"
      : "from-purple-700/5 to-purple-400/20";

  return (
    <div
      className={`
        w-full ${height} p-4 rounded-xl transition-all duration-300
        bg-black/50 backdrop-blur-sm border
      `}
      style={{
        borderColor: `${color}55`,
        boxShadow: `0 0 20px ${color}1a`,
      }}
    >
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color }}>
        <IconChart color={color} /> {title}
      </h3>

      <div className={`w-full ${height} -mt-4 bg-linear-to-t ${gradientStops} rounded-lg relative`}>
        <div
          className="absolute inset-0 border-t-2 border-dashed"
          style={{
            borderColor: `${color}88`,
            clipPath:
              "polygon(0% 80%, 20% 65%, 40% 75%, 60% 50%, 80% 60%, 100% 40%, 100% 100%, 0% 100%)",
          }}
        />
      </div>
    </div>
  );
};

export default function Stats() {
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
  const lessonAgg = useMemo(() => computeAggregates(lessonSessions), [lessonSessions]);
  const gameAgg = useMemo(() => computeAggregates(gameSessions), [gameSessions]);

  const wpmSeries = useMemo(() => groupDailySeries(sessions ?? [], "wpm"), [sessions]);
  const accSeries = useMemo(() => groupDailySeries(sessions ?? [], "accuracy"), [sessions]);

  return (
    <div
      className="relative w-full min-h-screen p-8 text-cyan-300 font-mono"
      style={{ backgroundColor: NEO_DARK }}
    >
      <h1 className="text-4xl font-extrabold text-white mb-10 tracking-wider text-center">
        PERFORMANCE ANALYSIS
      </h1>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="col-span-2">
          <StatMetricCard
            title="Average Speed (All)"
            value={allAgg.avgWpm}
            unit="WPM"
            color={NEO_BLUE}
          />
        </div>

        <div className="col-span-2">
          <StatMetricCard
            title="Average Accuracy (All)"
            value={allAgg.avgAccuracy}
            unit="%"
            color={NEO_PINK}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="col-span-2">
          <ChartPlaceholder title="WPM Progression Over Time" color={NEO_BLUE} height="h-96" />
        </div>
        <ChartPlaceholder title="Accuracy Trends" color={NEO_PINK} height="h-96" />
      </section>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatMetricCard
          title="Best WPM (All)"
          value={allAgg.bestWpm}
          unit="WPM"
          color={NEO_PURPLE}
        />

        <StatMetricCard
          title="Total Runs (All)"
          value={allAgg.totalRuns}
          unit="runs"
          color={NEO_BLUE}
        />

        <StatMetricCard
          title="Runs Split"
          value={`${lessonAgg.totalRuns} / ${gameAgg.totalRuns}`}
          unit="lessons/games"
          color={NEO_PINK}
        />
      </section>

      <pre className="max-w-6xl mx-auto mt-10 text-xs text-gray-400 overflow-auto">
        {JSON.stringify(
          {
            allAgg,
            lessonAgg,
            gameAgg,
            wpmSeries,
            accSeries,
            last5: (sessions ?? []).slice(0, 5),
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
