import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { KEYBOARD_ROWS } from "../../data/keyboardLayouts";
import { addSession } from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";
import { useSettings } from "../../context/useSettings";

const PASS_ACCURACY = 90;

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function buildCodeToLabelMap() {
  const m = new Map();
  for (const row of KEYBOARD_ROWS) {
    for (const k of row) {
      if (!k.code) continue;
      m.set(k.code, { en: k.labelEn ?? k.label ?? "", uk: k.labelUk ?? k.label ?? "" });
    }
  }
  return m;
}

export default function LessonTrainer({ config }) {
  const navigate = useNavigate();
  const { layout, language } = useSettings();
  const isUK = language === "uk";

  const codeToLabel = useMemo(() => buildCodeToLabelMap(), []);
  const labelOf = useCallback(
    (code) => {
      const it = codeToLabel.get(code);
      if (!it) return code;
      return (layout === "uk" ? it.uk : it.en) || code;
    },
    [codeToLabel, layout]
  );

  const { stages = [], reps = 20, id = "lesson" } = config;

  const allowedCodes = useMemo(() => {
    const s = new Set();
    for (const st of stages) for (const c of st) s.add(c);
    return Array.from(s);
  }, [stages]);

  const totalTarget = reps * stages.length;

  const [stageIndex, setStageIndex] = useState(0);
  const [completedInStage, setCompletedInStage] = useState(0);
  const [currentCode, setCurrentCode] = useState(null);

  const [mistakes, setMistakes] = useState(0);
  const [correctPresses, setCorrectPresses] = useState(0);

  const [keyboardErrorFlash, setKeyboardErrorFlash] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const savedRef = useRef(false);

  const accuracy = useMemo(() => {
    const total = correctPresses + mistakes;
    return total === 0 ? 100 : Math.round((correctPresses / total) * 100);
  }, [correctPresses, mistakes]);

  const progress = useMemo(() => {
    if (totalTarget <= 0) return 0;
    return Math.min(100, Math.round((correctPresses / totalTarget) * 100));
  }, [correctPresses, totalTarget]);

  const wpm = useMemo(() => {
    const minutes = elapsedMs / 60000;
    if (minutes <= 0) return 0;
    return Math.round((correctPresses / 5) / minutes);
  }, [elapsedMs, correctPresses]);

  const passed = accuracy >= PASS_ACCURACY;

  const highlightCodes = useMemo(() => (currentCode ? [currentCode] : []), [currentCode]);

  const generateNext = useCallback(
    (idx) => {
      const keys = stages[idx] ?? [];
      if (!keys.length) return;
      const random = keys[Math.floor(Math.random() * keys.length)];
      setCurrentCode(random);
    },
    [stages]
  );

  useEffect(() => {
    if (lessonFinished) return;
    const t = window.setTimeout(() => generateNext(stageIndex), 0);
    return () => window.clearTimeout(t);
  }, [stageIndex, generateNext, lessonFinished]);

  useEffect(() => {
    if (!startTime || lessonFinished) return;
    const interval = window.setInterval(() => setElapsedMs(Date.now() - startTime), 100);
    return () => window.clearInterval(interval);
  }, [startTime, lessonFinished]);

  useEffect(() => {
    if (!lessonFinished) return;
    if (savedRef.current) return;
    savedRef.current = true;

    addSession({
      mode: "lesson",
      id,
      wpm,
      accuracy,
      timeMs: elapsedMs,
      correct: correctPresses,
      mistakes,
      score: progress,
      createdAt: Date.now(),
    });

    emitStatsUpdate();
  }, [lessonFinished, id, wpm, accuracy, elapsedMs, correctPresses, mistakes, progress]);

  const handleKeyDown = useCallback(
    (e) => {
      if (lessonFinished) return;
      if (!currentCode) return;

      setStartTime((t) => (t ? t : Date.now()));

      const pressedCode = e.code;
      if (!pressedCode) return;

      if (pressedCode !== currentCode) {
        setMistakes((m) => m + 1);
        setKeyboardErrorFlash(true);
        window.setTimeout(() => setKeyboardErrorFlash(false), 450);
        return;
      }

      let nextStageIndex = stageIndex;

      setCompletedInStage((prev) => {
        const next = prev + 1;
        if (next >= reps) {
          nextStageIndex = Math.min(stageIndex + 1, stages.length - 1);
          setStageIndex(nextStageIndex);
          return 0;
        }
        return next;
      });

      setCorrectPresses((c) => {
        const nextCorrect = c + 1;
        if (nextCorrect >= totalTarget) {
          setLessonFinished(true);
        }
        return nextCorrect;
      });

      queueMicrotask(() => {
        if (!lessonFinished) generateNext(nextStageIndex);
      });
    },
    [lessonFinished, currentCode, stageIndex, reps, stages.length, totalTarget, generateNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const resetLesson = useCallback(() => {
    setLessonFinished(false);
    setStageIndex(0);
    setCompletedInStage(0);
    setMistakes(0);
    setCorrectPresses(0);
    setStartTime(null);
    setElapsedMs(0);
    setCurrentCode(null);
    setKeyboardErrorFlash(false);
    savedRef.current = false;

    window.setTimeout(() => generateNext(0), 0);
  }, [generateNext]);

  return (
    <div className="text-center">
      <div className="flex justify-start mb-4">
        <button
          onClick={() => navigate("/lessons")}
          className="px-4 py-2 rounded-lg border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition"
        >
          ← {isUK ? "Назад до уроків" : "Back to lessons"}
        </button>
      </div>

      <h2 className="text-2xl font-bold text-pink-400 mb-4">
        {isUK ? "Етап" : "Stage"} {stageIndex + 1} / {stages.length}
      </h2>

      <p className="text-gray-300 mb-2 text-lg">
        {isUK ? "Правильні натиски" : "Correct presses"}: {completedInStage} / {reps}
      </p>

      <p className="text-cyan-300 mb-4 font-bold text-xl">Total: {progress}%</p>

      <div className="flex justify-center gap-10 text-xl mb-6 font-bold">
        <div className="text-cyan-400">WPM: {wpm}</div>
        <div className="text-pink-400">{isUK ? "Точність" : "Accuracy"}: {accuracy}%</div>
      </div>

      {currentCode && (
        <div className="text-6xl mb-6 text-pink-500 font-bold drop-shadow-[0_0_20px_rgba(255,0,230,0.6)]">
          {labelOf(currentCode)}
        </div>
      )}

      <NeonKeyboard
        showLabels
        layout={layout}
        highlightCodes={highlightCodes}
        allowedCodes={allowedCodes}
        errorFlash={keyboardErrorFlash}
      />

      {lessonFinished && (
        <div className="mt-6 text-gray-300">
          {passed ? "✅ Passed" : "❌ Not passed"} · {isUK ? "Точність" : "Accuracy"} {accuracy}%
          <div className="mt-3 flex gap-3 justify-center">
            <button
              onClick={resetLesson}
              className="px-6 py-3 rounded-xl border border-pink-500/60 text-pink-300 hover:bg-pink-500/10"
            >
              {isUK ? "Ще раз" : "Retry"}
            </button>
            <button
              onClick={() => navigate("/lessons")}
              className="px-6 py-3 rounded-xl border border-cyan-400/60 text-cyan-200 hover:bg-cyan-400/10"
            >
              {isUK ? "До уроків" : "Lessons"}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Pass: Accuracy ≥ {PASS_ACCURACY}% · Time {formatTime(elapsedMs)}
          </div>
        </div>
      )}
    </div>
  );
}
