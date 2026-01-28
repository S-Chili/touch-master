const STORAGE_KEY = "tm_lesson_progress_v1";
const EVENT_NAME = "tm_lesson_progress_updated";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function write(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function loadLessonProgress() {
  const p = read();
  return {
    lastStarted: Number(p?.lastStarted) || 1,
    completed: Array.isArray(p?.completed)
      ? p.completed.map(Number).filter(Number.isFinite)
      : [],
  };
}

export function setLastStartedLesson(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n)) return;

  const cur = loadLessonProgress();
  write({ ...cur, lastStarted: n });
}

export function markLessonCompleted(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n)) return;

  const cur = loadLessonProgress();
  const set = new Set(cur.completed.map(Number));
  set.add(n);

  write({ ...cur, completed: Array.from(set).sort((a, b) => a - b) });
}

export function onLessonProgressUpdate(handler) {
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
