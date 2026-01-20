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
      m.set(k.code, {
        en: k.labelEn ?? k.label ?? "",
        uk: k.labelUk ?? k.label ?? "",
      });
    }
  }
  return m;
}

function isObj(v) {
  return v && typeof v === "object";
}

const LEFT_HAND = new Set([
  "KeyQ","KeyW","KeyE","KeyR","KeyT",
  "KeyA","KeyS","KeyD","KeyF","KeyG",
  "KeyZ","KeyX","KeyC","KeyV","KeyB",
]);
const RIGHT_HAND = new Set([
  "KeyY","KeyU","KeyI","KeyO","KeyP",
  "KeyH","KeyJ","KeyK","KeyL",
  "KeyN","KeyM",
  "Semicolon","Quote","Comma","Period","Slash",
  "BracketLeft","BracketRight",
]);

function requiredOppositeShift(code) {
  if (LEFT_HAND.has(code)) return "right";
  if (RIGHT_HAND.has(code)) return "left";
  return "left";
}

export default function LessonTrainer({ config }) {
  const navigate = useNavigate();
  const { layout, language } = useSettings();
  const isUK = language === "uk";

  const { stages = [], reps = 20, id = "lesson" } = config ?? {};
  const totalTarget = reps * stages.length;

  const codeToLabel = useMemo(() => buildCodeToLabelMap(), []);
  const labelOf = useCallback(
    (code) => {
      const it = codeToLabel.get(code);
      if (!it) return code;
      const v = layout === "uk" ? it.uk : it.en;
      return v || code;
    },
    [codeToLabel, layout]
  );

  const normStages = useMemo(() => {
    return stages.map((stage) =>
      (stage ?? []).map((it) => {
        if (typeof it === "string") return { code: it, shift: false };

        if (isObj(it)) {
          const code = it.code;
          let shift = it.shift ?? false;
          if (shift === "opposite") shift = requiredOppositeShift(code);
          return { code, shift }; 
        }

        return null;
      }).filter(Boolean)
    );
  }, [stages]);

  const allowedCodes = useMemo(() => {
    const s = new Set();
    for (const stage of normStages) {
      for (const t of stage) {
        s.add(t.code);
        if (t.shift && t.shift !== false) {
          s.add("ShiftLeft");
          s.add("ShiftRight");
        }
      }
    }
    return Array.from(s);
  }, [normStages]);

  const allowedSet = useMemo(() => new Set(allowedCodes), [allowedCodes]);

  const [stageIndex, setStageIndex] = useState(0);
  const [completedInStage, setCompletedInStage] = useState(0);
  const [currentTarget, setCurrentTarget] = useState(null); 

  const [mistakes, setMistakes] = useState(0);
  const [correctPresses, setCorrectPresses] = useState(0);

  const [keyboardErrorFlash, setKeyboardErrorFlash] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const savedRef = useRef(false);
  const finishedRef = useRef(false);
  const flashTimeoutRef = useRef(null);

  const shiftHeldRef = useRef({ left: false, right: false });

  useEffect(() => {
    finishedRef.current = lessonFinished;
  }, [lessonFinished]);

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

  const highlightCodes = useMemo(() => {
    if (!currentTarget) return [];
    const arr = [currentTarget.code];

    if (currentTarget.shift === "left") arr.push("ShiftLeft");
    if (currentTarget.shift === "right") arr.push("ShiftRight");
    if (currentTarget.shift === "any") {
      arr.push("ShiftLeft");
      arr.push("ShiftRight");
    }
    return arr;
  }, [currentTarget]);

  const generateNext = useCallback(
    (idx) => {
      const list = normStages[idx] ?? [];
      if (!list.length) return;
      const random = list[Math.floor(Math.random() * list.length)];
      setCurrentTarget(random);
    },
    [normStages]
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

  const flashError = useCallback(() => {
    setKeyboardErrorFlash(true);
    if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = window.setTimeout(() => setKeyboardErrorFlash(false), 450);
  }, []);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  const isShiftOk = useCallback((shiftRule) => {
    if (!shiftRule || shiftRule === false) {
      return !(shiftHeldRef.current.left || shiftHeldRef.current.right);
    }
    if (shiftRule === "any") return shiftHeldRef.current.left || shiftHeldRef.current.right;
    if (shiftRule === "left") return shiftHeldRef.current.left;
    if (shiftRule === "right") return shiftHeldRef.current.right;
    return false;
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (finishedRef.current) return;

      if (e.code === "ShiftLeft") {
        shiftHeldRef.current.left = true;
        return; 
      }
      if (e.code === "ShiftRight") {
        shiftHeldRef.current.right = true;
        return;
      }

      if (!currentTarget) return;

      const pressedCode = e.code;
      if (!pressedCode) return;

      if (!allowedSet.has(pressedCode)) return;

      setStartTime((t) => (t ? t : Date.now()));

      const codeOk = pressedCode === currentTarget.code;
      const shiftOk = isShiftOk(currentTarget.shift);

      if (!codeOk || !shiftOk) {
        setMistakes((m) => m + 1);
        flashError();
        return;
      }

      let nextStageIndex = stageIndex;

      setCompletedInStage((prev) => {
        const next = prev + 1;
        if (next >= reps) {
          nextStageIndex = Math.min(stageIndex + 1, normStages.length - 1);
          setStageIndex(nextStageIndex);
          return 0;
        }
        return next;
      });

      setCorrectPresses((c) => {
        const nextCorrect = c + 1;
        if (nextCorrect >= totalTarget) setLessonFinished(true);
        return nextCorrect;
      });

      queueMicrotask(() => {
        if (!finishedRef.current) generateNext(nextStageIndex);
      });
    },
    [
      allowedSet,
      currentTarget,
      stageIndex,
      reps,
      normStages.length,
      totalTarget,
      generateNext,
      flashError,
      isShiftOk,
    ]
  );

  const handleKeyUp = useCallback((e) => {
    if (e.code === "ShiftLeft") shiftHeldRef.current.left = false;
    if (e.code === "ShiftRight") shiftHeldRef.current.right = false;
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const resetLesson = useCallback(() => {
    setLessonFinished(false);
    finishedRef.current = false;

    setStageIndex(0);
    setCompletedInStage(0);
    setMistakes(0);
    setCorrectPresses(0);
    setStartTime(null);
    setElapsedMs(0);
    setCurrentTarget(null);
    setKeyboardErrorFlash(false);
    savedRef.current = false;

    shiftHeldRef.current.left = false;
    shiftHeldRef.current.right = false;

    window.setTimeout(() => generateNext(0), 0);
  }, [generateNext]);

  const bigChar = useMemo(() => {
    if (!currentTarget) return "";
    const base = labelOf(currentTarget.code);
    const showUpper = !!currentTarget.shift && currentTarget.shift !== false;
    return showUpper ? String(base).toUpperCase() : base;
  }, [currentTarget, labelOf]);

  const shiftHint = useMemo(() => {
    if (!currentTarget || !currentTarget.shift || currentTarget.shift === false) return null;
    if (currentTarget.shift === "any") return isUK ? "Тримай будь-який Shift" : "Hold any Shift";
    if (currentTarget.shift === "left") return isUK ? "Тримай ЛІВИЙ Shift" : "Hold LEFT Shift";
    if (currentTarget.shift === "right") return isUK ? "Тримай ПРАВИЙ Shift" : "Hold RIGHT Shift";
    return null;
  }, [currentTarget, isUK]);

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

      <h2 className="text-2xl font-bold text-pink-400 mb-2">
        {isUK ? "Етап" : "Stage"} {stageIndex + 1} / {normStages.length}
      </h2>

      {shiftHint && <div className="text-xs text-cyan-200/80 mb-4 tracking-widest uppercase">{shiftHint}</div>}

      <p className="text-gray-300 mb-2 text-lg">
        {isUK ? "Правильні натиски" : "Correct presses"}: {completedInStage} / {reps}
      </p>

      <p className="text-cyan-300 mb-4 font-bold text-xl">Total: {progress}%</p>

      <div className="flex justify-center gap-10 text-xl mb-6 font-bold">
        <div className="text-cyan-400">WPM: {wpm}</div>
        <div className="text-pink-400">{isUK ? "Точність" : "Accuracy"}: {accuracy}%</div>
      </div>

      {!!bigChar && (
        <div className="text-6xl mb-6 text-pink-500 font-bold drop-shadow-[0_0_20px_rgba(255,0,230,0.6)]">
          {bigChar}
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
