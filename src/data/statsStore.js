const STORAGE_KEY = "tm_stats_sessions_v1";

function safeNumber(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSession(raw) {
  return {
    mode: raw?.mode === "game" ? "game" : "lesson",
    id: raw?.id ?? "unknown",
    wpm: safeNumber(raw?.wpm, 0),
    accuracy: safeNumber(raw?.accuracy, 100),
    timeMs: safeNumber(raw?.timeMs, 0),
    correct: safeNumber(raw?.correct, 0),
    mistakes: safeNumber(raw?.mistakes, 0),
    score: safeNumber(raw?.score, 0),
    createdAt: safeNumber(raw?.createdAt, Date.now()),
  };
}

export function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map(normalizeSession);
  } catch {
    return [];
  }
}

export function saveSessions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addSession(session) {
  const normalized = normalizeSession(session);
  const prev = loadSessions();
  const next = [normalized, ...prev].slice(0, 2000);
  saveSessions(next);
  return next;
}

export function clearSessions() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

export function computeAggregates(sessions) {
  const list = Array.isArray(sessions) ? sessions : [];

  const totalRuns = list.length;

  const avgWpm =
    totalRuns === 0
      ? 0
      : Math.round(
          list.reduce((sum, s) => sum + safeNumber(s.wpm, 0), 0) / totalRuns,
        );

  const avgAccuracy =
    totalRuns === 0
      ? 100
      : Math.round(
          (list.reduce((sum, s) => sum + safeNumber(s.accuracy, 100), 0) /
            totalRuns) *
            10,
        ) / 10;

  const bestWpm =
    totalRuns === 0 ? 0 : Math.max(...list.map((s) => safeNumber(s.wpm, 0)));

  return { avgWpm, avgAccuracy, bestWpm, totalRuns };
}

function dayKey(ts) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function groupDailySeries(sessions, field = "wpm") {
  const list = Array.isArray(sessions) ? sessions : [];

  const map = new Map();
  for (const s of list) {
    const date = dayKey(s.createdAt);
    const v = safeNumber(s[field], 0);

    const prev = map.get(date) ?? { sum: 0, count: 0 };
    map.set(date, { sum: prev.sum + v, count: prev.count + 1 });
  }

  const out = Array.from(map.entries())
    .map(([date, { sum, count }]) => {
      const value = count ? Math.round((sum / count) * 10) / 10 : 0;

      return {
        date,
        value,
        count,
        x: Date.parse(date),
        y: value,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return out;
}

export function seriesBySession(sessions, field = "wpm") {
  const list = Array.isArray(sessions) ? sessions : [];
  return list
    .map((s) => ({ x: s.createdAt, y: safeNumber(s[field], 0) }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
    .sort((a, b) => a.x - b.x);
}

export function getSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setSessions(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next ?? []));
}
