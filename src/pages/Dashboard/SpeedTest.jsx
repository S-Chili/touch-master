import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { addSession } from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";
import { useSettings } from "../../context/useSettings";
import { KEYBOARD_ROWS } from "../../data/keyboardLayouts";

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

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";

const LETTER_CODES = [
  "KeyA","KeyB","KeyC","KeyD","KeyE","KeyF","KeyG","KeyH","KeyI","KeyJ","KeyK","KeyL","KeyM",
  "KeyN","KeyO","KeyP","KeyQ","KeyR","KeyS","KeyT","KeyU","KeyV","KeyW","KeyX","KeyY","KeyZ",
];

function formatTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
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
            px-3 py-2 text-xs font-bold tracking-widest uppercase transition-all
            ${active ? "bg-cyan-500/15 text-cyan-200" : "text-gray-400 hover:bg-white/5"}
          `}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

function ResultModal({ open, isUK, wpm, accuracy, correct, mistakes, timeMs, onRetry, onBack }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl border bg-black/70 p-6"
        style={{
          borderColor: "rgba(0,234,255,0.35)",
          boxShadow: "0 0 60px rgba(0,234,255,0.12)",
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-extrabold tracking-wider">
              {isUK ? "Результат Speed Test" : "Speed Test Result"}
            </h3>
            <p className="mt-1 text-gray-400">
              {isUK ? "Готово. Це твоя швидкість на літерах A–Z." : "Done. Your speed on letters A–Z."}
            </p>
          </div>
          <div className="text-xs text-gray-500 tracking-widest uppercase">{formatTime(timeMs)}</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-cyan-400/20 bg-black/40 p-3">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">WPM</div>
            <div className="mt-1 text-cyan-200 text-2xl font-bold">{wpm}</div>
          </div>

          <div className="rounded-xl border border-pink-400/20 bg-black/40 p-3">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">
              {isUK ? "Точність" : "Accuracy"}
            </div>
            <div className="mt-1 text-pink-200 text-2xl font-bold">{accuracy}%</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">
              {isUK ? "Правильно" : "Correct"}
            </div>
            <div className="mt-1 text-gray-200 text-xl font-bold">{correct}</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">
              {isUK ? "Помилки" : "Mistakes"}
            </div>
            <div className="mt-1 text-gray-200 text-xl font-bold">{mistakes}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onRetry}
            className="px-5 py-3 rounded-xl border border-pink-500/60 text-pink-200 hover:bg-pink-500/10 transition"
          >
            {isUK ? "Спробувати ще раз" : "Retry"}
          </button>

          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-cyan-400/60 text-cyan-200 hover:bg-cyan-400/10 transition"
          >
            {isUK ? "Назад" : "Back"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SpeedTest() {
  const navigate = useNavigate();
  const { layout, language } = useSettings();
  const isUK = language === "uk";

  const [durationSec, setDurationSec] = useState(60); 

  const [startedAt, setStartedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finished, setFinished] = useState(false);

  const [mistakes, setMistakes] = useState(0);
  const [correctPresses, setCorrectPresses] = useState(0);

  const [keyboardErrorFlash, setKeyboardErrorFlash] = useState(false);

  const finishedRef = useRef(false);
  const savedRef = useRef(false);
  const flashTimeoutRef = useRef(null);

  const [currentTargetCode, setCurrentTargetCode] = useState(() => {
    return LETTER_CODES[Math.floor(Math.random() * LETTER_CODES.length)];
  });

  const totalMs = durationSec * 1000;
  const remainingMs = Math.max(0, totalMs - elapsedMs);

  const accuracy = useMemo(() => {
    const total = correctPresses + mistakes;
    return total === 0 ? 100 : Math.round((correctPresses / total) * 100);
  }, [correctPresses, mistakes]);

  const wpm = useMemo(() => {
    const minutes = elapsedMs / 60000;
    if (minutes <= 0) return 0;
    return Math.round((correctPresses / 5) / minutes);
  }, [elapsedMs, correctPresses]);

  const generateTarget = useCallback(() => {
    const rand = LETTER_CODES[Math.floor(Math.random() * LETTER_CODES.length)];
    setCurrentTargetCode(rand);
  }, []);

  const flashError = useCallback(() => {
    setKeyboardErrorFlash(true);
    if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = window.setTimeout(() => setKeyboardErrorFlash(false), 350);
  }, []);

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  useEffect(() => {
    if (!startedAt || finished) return;
    const id = window.setInterval(() => {
      const ms = Date.now() - startedAt;
      setElapsedMs(ms);
      if (ms >= totalMs) setFinished(true);
    }, 80);
    return () => window.clearInterval(id);
  }, [startedAt, finished, totalMs]);

  useEffect(() => {
    if (!finished) return;
    if (savedRef.current) return;
    savedRef.current = true;

    addSession({
      mode: "test",          
      id: "speed_test",
      wpm,
      accuracy,
      timeMs: Math.min(elapsedMs, totalMs),
      correct: correctPresses,
      mistakes,
      score: wpm,            
      createdAt: Date.now(),
    });

    emitStatsUpdate();
  }, [finished, wpm, accuracy, elapsedMs, totalMs, correctPresses, mistakes]);

  const handleKeyDown = useCallback(
    (e) => {
      if (finishedRef.current) return;

      const code = e.code;
      if (!LETTER_CODES.includes(code)) return;

      setStartedAt((t) => (t ? t : Date.now()));

      if (!currentTargetCode) return;

      const ok = code === currentTargetCode;
      if (!ok) {
        setMistakes((m) => m + 1);
        flashError();
        return;
      }

      setCorrectPresses((c) => c + 1);
      generateTarget();
    },
    [currentTargetCode, flashError, generateTarget]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) window.clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    setFinished(false);
    finishedRef.current = false;
    savedRef.current = false;

    setStartedAt(null);
    setElapsedMs(0);
    setMistakes(0);
    setCorrectPresses(0);
    setKeyboardErrorFlash(false);
    setCurrentTargetCode(null);
  }, []);
    
    const codeToLabel = useMemo(() => buildCodeToLabelMap(), []);
    const labelOf = useCallback(
    (code) => {
        const it = codeToLabel.get(code);
        if (!it) return "";
        const v = layout === "uk" ? it.uk : it.en;
        return v || "";
    },
    [codeToLabel, layout]
    );

    const bigChar = useMemo(() => {
    if (!currentTargetCode) return "";
    const base = labelOf(currentTargetCode);
    if (!base) return "";
    return String(base).toUpperCase();
    }, [currentTargetCode, labelOf]);

  return (
    <div className="relative w-full min-h-screen text-cyan-300 font-mono px-2">
      <div className="max-w-5xl mx-auto pt-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition"
          >
            ← {isUK ? "Назад" : "Back"}
          </button>

          <Segmented
            value={durationSec}
            onChange={setDurationSec}
            options={[
              { value: 60, label: "60s" },
              { value: 120, label: "120s" },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-black/45 backdrop-blur-sm p-6 shadow-[0_0_28px_rgba(0,234,255,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-widest text-white">
                {isUK ? "SPEED TEST" : "SPEED TEST"}
              </h1>
              <p className="mt-2 text-gray-400">
                {isUK
                  ? "Друкуй лише літери A–Z. Тест стартує з першої правильної/неправильної літери."
                  : "Type letters A–Z only. Test starts on your first letter key."}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500 tracking-widest uppercase">
                {isUK ? "Залишилось" : "Time left"}
              </div>
              <div className="text-2xl font-bold text-white">
                {formatTime(remainingMs)}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-10 text-xl font-bold">
            <div className="text-cyan-400">WPM: {wpm}</div>
            <div className="text-pink-400">{isUK ? "Точність" : "Accuracy"}: {accuracy}%</div>
          </div>

          <div
            className="mt-7 text-center text-7xl font-extrabold"
            style={{
              color: NEO_PINK,
              textShadow: "0 0 22px rgba(255,0,230,0.55)",
            }}
          >
            {bigChar}
          </div>

          <div className="mt-6">
            <NeonKeyboard
              showLabels
              layout={layout}
              highlightCodes={currentTargetCode ? [currentTargetCode] : []} 
              allowedCodes={LETTER_CODES}
              errorFlash={keyboardErrorFlash}
            />
          </div>

          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={reset}
              className="px-5 py-2 rounded-xl border border-pink-500/50 text-pink-200 hover:bg-pink-500/10 transition"
            >
              {isUK ? "Скинути" : "Reset"}
            </button>
            <button
              onClick={() => setFinished(true)}
              className="px-5 py-2 rounded-xl border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition"
            >
              {isUK ? "Завершити" : "Finish"}
            </button>
          </div>

          <div className="mt-3 text-center text-xs text-gray-500">
            {isUK ? "Рахується тільки правильний символ (WPM), помилки знижують точність." : "Only correct keys increase WPM; mistakes reduce accuracy."}
          </div>
        </div>
      </div>

      <ResultModal
        open={finished}
        isUK={isUK}
        wpm={wpm}
        accuracy={accuracy}
        correct={correctPresses}
        mistakes={mistakes}
        timeMs={Math.min(elapsedMs, totalMs)}
        onRetry={() => {
          reset();
        }}
        onBack={() => {
          navigate("/dashboard");
        }}
      />
    </div>
  );
}
