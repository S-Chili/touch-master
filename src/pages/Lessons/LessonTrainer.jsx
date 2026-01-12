import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { addSession } from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";


const PASS_ACCURACY = 90;

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function LessonResultModal({
  isOpen,
  passed,
  progress,
  accuracy,
  wpm,
  elapsedMs,
  passAccuracy,
  onExit,
  onRetry,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* modal */}
      <div
        className="relative w-[92%] max-w-xl rounded-2xl border border-cyan-400/40 bg-black/80 p-8
                   shadow-[0_0_40px_rgba(0,234,255,0.25)]"
      >
        <div className="text-center">
          <div className="text-sm tracking-[0.35em] text-cyan-300/80 mb-3">
            TOUCHMASTER REPORT
          </div>

          {passed ? (
            <h2 className="text-3xl font-extrabold text-pink-400 drop-shadow-[0_0_18px_rgba(255,0,230,0.45)]">
              Вітаємо! Урок пройдений ✅
            </h2>
          ) : (
            <h2 className="text-3xl font-extrabold text-pink-400 drop-shadow-[0_0_18px_rgba(255,0,230,0.45)]">
              Майже! Спробуй ще раз 🔁
            </h2>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 text-left">
            <div className="rounded-xl border border-cyan-500/20 bg-black/40 p-4">
              <div className="text-xs text-gray-400">Total</div>
              <div className="text-2xl font-bold text-cyan-300">{progress}%</div>
            </div>

            <div className="rounded-xl border border-pink-500/20 bg-black/40 p-4">
              <div className="text-xs text-gray-400">Accuracy</div>
              <div className="text-2xl font-bold text-pink-400">
                {accuracy}%
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-black/40 p-4">
              <div className="text-xs text-gray-400">WPM</div>
              <div className="text-2xl font-bold text-cyan-300">{wpm}</div>
            </div>

            <div className="rounded-xl border border-gray-500/20 bg-black/40 p-4">
              <div className="text-xs text-gray-400">Time</div>
              <div className="text-2xl font-bold text-white">
                {formatTime(elapsedMs)}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {passed ? (
              <button
                onClick={onExit}
                className="px-8 py-3 rounded-xl font-bold border border-cyan-400/60 text-cyan-300
                           hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,234,255,0.35)] transition-all"
              >
                OK
              </button>
            ) : (
              <>
                <button
                  onClick={onRetry}
                  className="px-8 py-3 rounded-xl font-bold border border-pink-500/60 text-pink-400
                             hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(255,0,230,0.35)] transition-all"
                >
                  OK (ще раз)
                </button>
                <button
                  onClick={onExit}
                  className="px-8 py-3 rounded-xl font-bold border border-cyan-400/60 text-cyan-300
                             hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,234,255,0.35)] transition-all"
                >
                  Вийти
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Pass condition: Accuracy ≥ {passAccuracy}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LessonTrainer({ config }) {
  const navigate = useNavigate();
  const { allowedKeys = [], stages = [], reps = 20 } = config;

  const totalTarget = reps * stages.length;

  const [stageIndex, setStageIndex] = useState(0);
  const [completedInStage, setCompletedInStage] = useState(0);
  const [currentKey, setCurrentKey] = useState(null);

  const [mistakes, setMistakes] = useState(0);
  const [correctPresses, setCorrectPresses] = useState(0);

  const [keyboardErrorFlash, setKeyboardErrorFlash] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  // Timer
  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const highlightKeys = currentKey ? [currentKey.toLowerCase()] : [];
  const savedRef = useRef(false);


  const accuracy = useMemo(() => {
    const total = correctPresses + mistakes;
    if (total === 0) return 100;
    return Math.round((correctPresses / total) * 100);
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

  const passed = useMemo(() => accuracy >= PASS_ACCURACY, [accuracy]);

  const generateNextKey = useCallback((idx = stageIndex) => {
  const keys = stages[idx];
  const random = keys[Math.floor(Math.random() * keys.length)];
  setCurrentKey(random);
}, [stageIndex, stages]);

  useEffect(() => {
  if (!lessonFinished) return;
  if (savedRef.current) return;
  savedRef.current = true;

  addSession({
    mode: "lesson",
    id: config?.id ?? "lesson",
    wpm,
    accuracy,
    timeMs: elapsedMs,
    correct: correctPresses,
    mistakes,
    score: progress, // Total %
    createdAt: Date.now(),
  });

  emitStatsUpdate();
}, [
  lessonFinished,
  config?.id,
  wpm,
  accuracy,
  elapsedMs,
  correctPresses,
  mistakes,
  progress,
]);


const handleKeyPress = useCallback(
  (e) => {
    if (lessonFinished) return;
    if (!currentKey) return;

    const pressed = e.key.toLowerCase();
    const needed = currentKey.toLowerCase();

    // start timer on first press (any)
    setStartTime((t) => (t ? t : Date.now()));

    if (pressed !== needed) {
      setMistakes((m) => m + 1);

      setKeyboardErrorFlash(true);
      window.setTimeout(() => setKeyboardErrorFlash(false), 450);
      return;
    }

    // ✅ CORRECT PRESS
    let nextStageIndex = stageIndex; // локально порахуємо куди йдемо далі

    setCompletedInStage((prev) => {
      const next = prev + 1;

      // stage complete -> go next stage
      if (next >= reps) {
        nextStageIndex = Math.min(stageIndex + 1, stages.length - 1);
        setStageIndex(nextStageIndex);
        return 0;
      }

      return next;
    });

    setCorrectPresses((c) => {
      const nextCorrect = c + 1;

      // ✅ lesson complete based on TOTAL correct presses
      if (nextCorrect >= totalTarget) {
        setLessonFinished(true);
        return nextCorrect;
      }

      return nextCorrect;
    });

    // ✅ always generate next key (but for correct stage)
    // if stage advanced, we need to generate using the new stage
    // so we schedule it to run after state updates
    queueMicrotask(() => {
      // якщо урок вже завершився — не генеруємо
      if (!lessonFinished) {
        generateNextKey(nextStageIndex);
      }
    });
  },
  [
    lessonFinished,
    currentKey,
    reps,
    stageIndex,
    stages.length,
    totalTarget,
    generateNextKey,
  ]
);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!startTime || lessonFinished) return;

    const interval = window.setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    return () => window.clearInterval(interval);
  }, [startTime, lessonFinished]);

  // ESLint-safe: new key on stage change
  useEffect(() => {
    if (lessonFinished) return;

    const t = window.setTimeout(() => {
      generateNextKey(stageIndex);
    }, 0);

    return () => window.clearTimeout(t);
  }, [stageIndex, generateNextKey, lessonFinished]);

  const resetLesson = useCallback(() => {
    setLessonFinished(false);
    setStageIndex(0);
    setCompletedInStage(0);
    setMistakes(0);
    setCorrectPresses(0);
    setStartTime(null);
    setElapsedMs(0);
    setCurrentKey(null);
    setKeyboardErrorFlash(false);
    savedRef.current = false;

    window.setTimeout(() => {
      generateNextKey(0);
    }, 0);
  }, [generateNextKey]);

  return (
    <div className="text-center">
      <LessonResultModal
        isOpen={lessonFinished}
        passed={passed}
        progress={progress}
        accuracy={accuracy}
        wpm={wpm}
        elapsedMs={elapsedMs}
        passAccuracy={PASS_ACCURACY}
        onExit={() => navigate("/lessons")}
        onRetry={resetLesson}
      />

      <h2 className="text-2xl font-bold text-pink-400 mb-4">
        Stage {stageIndex + 1} / {stages.length}
      </h2>

      <p className="text-gray-300 mb-2 text-lg">
        Correct presses: {completedInStage} / {reps}
      </p>

      <p className="text-cyan-300 mb-4 font-bold text-xl">Total: {progress}%</p>

      <div className="flex justify-center gap-10 text-xl mb-6 font-bold">
        <div className="text-cyan-400">WPM: {wpm}</div>
        <div className="text-pink-400">Accuracy: {accuracy}%</div>
      </div>

      {currentKey && (
        <div className="text-6xl mb-6 text-pink-500 font-bold drop-shadow-[0_0_20px_rgba(255,0,230,0.6)]">
          {currentKey}
        </div>
      )}

      <NeonKeyboard
        showLabels={false}
        highlightKeys={highlightKeys}
        allowedKeys={allowedKeys}
        errorFlash={keyboardErrorFlash}
      />
    </div>
  );
}
