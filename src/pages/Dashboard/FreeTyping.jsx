import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/useSettings";

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";
const NEO_DARK = "#0a0c11";

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function keyToChar(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return null;

  if (e.key === "Enter") return "\n";
  if (e.key === "Tab") return "  "; 
  if (e.key === " ") return " ";

  if (e.key && e.key.length === 1) return e.key;

  return null;
}

export default function FreeTyping() {
  const navigate = useNavigate();
  const { language } = useSettings();
  const isUK = language === "uk";

  const [text, setText] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const [typedCount, setTypedCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const pauseStartedAtRef = useRef(null);
  const pausedTotalRef = useRef(0);


  const paperEndRef = useRef(null);

  const started = !!startedAt;

  useEffect(() => {
  if (!startedAt || paused) return;

  const id = setInterval(() => {
    setElapsedMs(Date.now() - startedAt - pausedTotalRef.current);
  }, 120);

  return () => clearInterval(id);
}, [startedAt, paused]);


  useEffect(() => {
    paperEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [text]);

    const minutes = elapsedMs / 60000;
    
    const togglePause = useCallback(() => {
  if (!startedAt) return;

  if (!paused) {
    pauseStartedAtRef.current = Date.now();
    setPaused(true);
  } else {
    const pauseDuration = Date.now() - pauseStartedAtRef.current;
    pausedTotalRef.current += pauseDuration;
    pauseStartedAtRef.current = null;
    setPaused(false);
  }
}, [paused, startedAt]);

  const wpm = useMemo(() => {
    if (!startedAt || minutes <= 0) return 0;
    const words = typedCount / 5;
    return Math.round(words / minutes);
  }, [startedAt, minutes, typedCount]); 

  const chars = useMemo(() => text.length, [text]);
  const wordsCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [text]);

  const resetAll = useCallback(() => {
    setText("");
    setStartedAt(null);
    setElapsedMs(0);
    setTypedCount(0);
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert(isUK ? "Скопійовано ✅" : "Copied ✅");
    } catch {
      alert(isUK ? "Не вдалося скопіювати" : "Copy failed");
    }
  }, [text, isUK]);

    const onKeyDown = useCallback((e) => {
      if (paused) {
        e.preventDefault();
        return;
      }
        
    if (e.key === "Backspace") {
      e.preventDefault();
      setText((t) => (t.length ? t.slice(0, -1) : t));
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      resetAll();
      return;
    }

    const ch = keyToChar(e);
    if (ch == null) return;

    e.preventDefault();

    setStartedAt((t) => (t ? t : Date.now()));
    setText((prev) => prev + ch);

    setTypedCount((c) => c + ch.length);
  }, [resetAll, setTypedCount, paused]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const title = isUK ? "ВІЛЬНИЙ РЕЖИМ" : "FREE TYPING MODE";
  const subtitle = isUK
    ? "Друкуй будь-що. Рахується тільки WPM. Backspace працює. Esc — очистити."
    : "Type anything. Only WPM is tracked. Backspace works. Esc — clear.";

  return (
    <div
      className="relative w-full min-h-screen p-8 text-cyan-300 font-mono"
      style={{ backgroundColor: NEO_DARK }}
    >
      <div className="absolute inset-0 opacity-6 bg-[linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,0,200,0.02)_1px,transparent_1px)] bg-size-[80px_80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition"
          >
            ← {isUK ? "Назад" : "Back"}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-lg border border-pink-500/40 text-pink-200 hover:bg-pink-500/10 transition"
              disabled={!text}
              title={isUK ? "Скопіювати текст" : "Copy text"}
              style={{ opacity: text ? 1 : 0.5 }}
            >
              {isUK ? "Копіювати" : "Copy"}
            </button>
            <button
                onClick={togglePause}
                disabled={!startedAt}
                className="px-4 py-2 rounded-lg border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10 transition"
                style={{ opacity: startedAt ? 1 : 0.5 }}
                >
                {paused
                    ? (isUK ? "▶ Продовжити" : "▶ Resume")
                    : (isUK ? "⏸ Пауза" : "⏸ Pause")}
            </button>

            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-lg border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10 transition"
              title={isUK ? "Очистити (Esc)" : "Clear (Esc)"}
            >
              {isUK ? "Очистити" : "Clear"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-white tracking-wider">
            {title}
          </h1>
          <p className="text-gray-400 mt-2">{subtitle}</p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-xl bg-black/50 border backdrop-blur"
          style={{ borderColor: `${NEO_BLUE}33`, boxShadow: `0 0 22px ${NEO_BLUE}14` }}
        >
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">{isUK ? "WPM" : "WPM"}</span>
            <span className="text-2xl font-bold text-white">{wpm}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400">{isUK ? "Час" : "Time"}</span>
            <span className="text-2xl font-bold text-white">{formatTime(elapsedMs)}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400">{isUK ? "Слова" : "Words"}</span>
            <span className="text-2xl font-bold text-white">{wordsCount}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400">{isUK ? "Символи" : "Chars"}</span>
            <span className="text-2xl font-bold text-white">{chars}</span>
          </div>
        </div>
        {paused && (
            <div className="mb-3 text-center text-pink-400 font-bold tracking-widest">
                ⏸ {isUK ? "ПАУЗА" : "PAUSED"}
            </div>
        )}
        <div
          className="rounded-2xl border bg-black/40 backdrop-blur p-5"
          style={{
            borderColor: `${NEO_PINK}2a`,
            boxShadow: `0 0 28px ${NEO_PINK}12`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-gray-400 tracking-widest uppercase">
              {isUK ? "Поле друку (A4)" : "Typing paper (A4)"}
            </div>
            <div className="text-xs text-gray-500">
              {started ? (isUK ? "Пишемо..." : "Typing...") : (isUK ? "Натисни будь-яку клавішу" : "Press any key")}
            </div>
          </div>

          <div
            className="mx-auto bg-white/95 text-black rounded-xl border border-white/20"
            style={{
              width: "min(820px, 100%)",
              aspectRatio: "1 / 1.414", 
              boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            <div
              className="h-full w-full p-10 overflow-auto font-serif"
              style={{
                lineHeight: "1.65",
                fontSize: "16px",
                position: "relative",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(to bottom, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 28px)",
                  pointerEvents: "none",
                  opacity: 0.35,
                }}
              />

              <pre
                className="whitespace-pre-wrap wrap-break-word"
                style={{ position: "relative", margin: 0 }}
              >
                {text}
                <span
                  style={{
                    display: "inline-block",
                    width: "9px",
                    height: "18px",
                    marginLeft: "2px",
                    background: "rgba(0,0,0,0.65)",
                    transform: "translateY(3px)",
                    animation: "blink 1s steps(1) infinite",
                  }}
                />
              </pre>
              <div ref={paperEndRef} />
            </div>
          </div>

          <div className="mt-4 text-[11px] text-gray-500">
            {isUK
              ? "Порада: Esc — очистити. Tab = 2 пробіли. Enter — новий рядок."
              : "Tip: Esc clears. Tab = 2 spaces. Enter for a new line."}
          </div>
        </div>

        <style>{`
          @keyframes blink { 50% { opacity: 0; } }
        `}</style>
      </div>
    </div>
  );
}
