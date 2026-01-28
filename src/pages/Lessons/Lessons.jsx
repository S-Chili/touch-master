import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import lessons from "../../data/lessonData";
import { useSettings } from "../../context/useSettings";
import {
  onLessonProgressUpdate,
  loadLessonProgress,
  setLastStartedLesson,
} from "../../data/lessonProgressStore";

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";
const NEO_DARK = "#0a0c11";

const IconBook = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    className="mx-auto mb-4 opacity-100 transition-all duration-300"
    stroke={NEO_BLUE}
    strokeWidth="1"
    strokeLinecap="round"
  >
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="14" y2="15" />
    <line x1="5" y1="3" x2="5" y2="21" strokeDasharray="2 3" />
  </svg>
);

const CurrentLessonCard = ({ lessonNumber, title, subtitle }) => (
  <div
    className="w-full max-w-lg mx-auto p-8 rounded-2xl border-2 bg-black/50 text-center"
    style={{
      borderColor: NEO_BLUE,
      boxShadow: "0 0 30px rgba(0,234,255,0.4)",
    }}
  >
    <div className="flex justify-center mb-4">
      <IconBook />
    </div>

    <div className="text-xl font-bold tracking-widest text-white mb-1">
      STEP {lessonNumber}
    </div>

    <h2
      className="text-4xl font-extrabold drop-shadow-[0_0_5px_rgba(255,0,230,0.5)]"
      style={{ color: NEO_PINK }}
    >
      {title}
    </h2>

    {subtitle ? <div className="text-sm text-gray-400 mt-3">{subtitle}</div> : null}
  </div>
);

const LessonItem = ({ number, title, isUK, active }) => {
  const baseClass =
    "p-4 rounded-xl border transition-all duration-300 flex items-center space-x-4 bg-black/30";

  if (!active) {
    return (
      <div
        className={`${baseClass} opacity-35 cursor-not-allowed`}
        style={{
          borderColor: NEO_BLUE,
          boxShadow: "0 0 15px rgba(0,234,255,0.08)",
        }}
      >
        <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 border border-current text-white text-sm font-bold">
          {number}
        </div>

        <div className="flex-1">
          <div className="text-xs text-gray-500">
            {isUK ? `Урок ${number}` : `Lesson ${number}`}
          </div>
          <div className="text-md font-semibold text-gray-400">{title}</div>
        </div>

        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Locked</div>
      </div>
    );
  }

  return (
    <Link
      to={`/lessons/${number}`}
      className={`${baseClass} opacity-100 hover:border-white cursor-pointer`}
      style={{
        borderColor: NEO_BLUE,
        boxShadow: "0 0 15px rgba(0,234,255,0.15)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 25px rgba(0,234,255,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 15px rgba(0,234,255,0.15)";
      }}
    >
      <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 border border-current text-white text-sm font-bold">
        {number}
      </div>

      <div>
        <div className="text-xs text-gray-400">
          {isUK ? `Урок ${number}` : `Lesson ${number}`}
        </div>
        <div className="text-md font-semibold text-white">{title}</div>
      </div>
    </Link>
  );
};

export default function Lessons() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const [progress, setProgress] = useState(() => loadLessonProgress());

  const list = useMemo(() => {
    const arr = Array.isArray(lessons) ? lessons : [];
    return arr
      .map((l) => ({
        number: Number(l.id),
        title: isUK ? l.titleUk : l.titleEn,
        description: isUK ? l.descriptionUk : l.descriptionEn,
      }))
      .filter((l) => Number.isFinite(l.number))
      .sort((a, b) => a.number - b.number);
  }, [isUK]);

  const completedSet = useMemo(() => new Set(progress.completed ?? []), [progress.completed]);

  const totalLessons = list.length;

  const consecutiveDone = useMemo(() => {
    let n = 0;
    for (let i = 1; i <= totalLessons; i++) {
      if (!completedSet.has(i)) break;
      n++;
    }
    return n;
  }, [completedSet, totalLessons]);


const allUnlocked = consecutiveDone >= totalLessons;

const isActiveLesson = useCallback(
  (num) => (allUnlocked ? true : num <= consecutiveDone + 1),
  [allUnlocked, consecutiveDone]
);

  const currentLessonNumber = useMemo(() => {
  const last = progress.lastStarted;

  if (Number.isFinite(last) && last >= 1 && last <= totalLessons) {
    if (!completedSet.has(last)) return last;
  }

  const next = Math.min(consecutiveDone + 1, totalLessons);
  return next;
}, [progress.lastStarted, completedSet, consecutiveDone, totalLessons]);

const currentLesson = useMemo(
  () => list.find((l) => l.number === currentLessonNumber),
  [list, currentLessonNumber]
);

useEffect(() => {
  const off = onLessonProgressUpdate(() => {
    setProgress(loadLessonProgress());
  });

  const onFocus = () => setProgress(loadLessonProgress());
  window.addEventListener("focus", onFocus);

  return () => {
    off();
    window.removeEventListener("focus", onFocus);
  };
}, []);


  const subtitle = useMemo(() => {
    if (!currentLesson) return "";
    const done = completedSet.has(currentLesson.number);

    if (consecutiveDone >= 9) {
      return isUK ? "Всі уроки відкриті ✅" : "All lessons unlocked ✅";
    }

    if (done) {
      return isUK ? "Урок пройдено. Переходимо далі →" : "Completed. Moving on →";
    }

    return isUK ? "Пройди урок, щоб відкрити наступний" : "Finish to unlock the next lesson";
  }, [currentLesson, completedSet, consecutiveDone, isUK]);

  const onOpenLesson = useCallback((num) => {
  setLastStartedLesson(num);
  setProgress(loadLessonProgress());
}, []);


  return (
    <div
      className="relative w-full min-h-screen p-8 text-cyan-300 font-mono"
      style={{ backgroundColor: NEO_DARK }}
    >
      <h1 className="text-4xl font-extrabold text-white mb-10 tracking-wider text-center">
        {isUK ? "ШЛЯХ ДРУКУ" : "TYPING PATH"}
      </h1>

      <div className="flex flex-col items-center justify-center mb-10">
        {currentLesson && (
          <CurrentLessonCard
            lessonNumber={currentLesson.number}
            title={currentLesson.title}
            subtitle={subtitle}
          />
        )}

        {currentLesson && (
          <Link
            to={`/lessons/${currentLesson.number}`}
            onClick={() => onOpenLesson(currentLesson.number)}
            className="mt-8 px-10 py-3 text-xl font-bold rounded-lg border-2 transition-all duration-300 active:scale-95"
            style={{
              borderColor: NEO_BLUE,
              color: NEO_BLUE,
              boxShadow: "0 0 15px rgba(0,234,255,0.6)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = NEO_BLUE;
              e.currentTarget.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = NEO_BLUE;
            }}
          >
            {isUK ? "Продовжити →" : "Continue Training →"}
          </Link>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-400 mb-6 border-b border-gray-700/50 pb-2">
          {isUK ? "Огляд уроків" : "Lesson Path Overview"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((lesson) => (
  <LessonItem
    key={lesson.number}
    number={lesson.number}
    title={lesson.title}
    isUK={isUK}
    active={isActiveLesson(lesson.number)}
  />
))}

        </div>
      </div>
    </div>
  );
}
