import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { addSession } from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";
import { KEYBOARD_ROWS } from "../../data/keyboardLayouts";
import { useSettings } from "../../context/useSettings";

const DEFAULT_ALLOWED_CODES = [
  "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP",
  "KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL",
  "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM",
];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
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

function ResultModal({
  open,
  ui,
  wpm,
  accuracy,
  correct,
  mistakes,
  totalKeys,
  durationSec,
  onAgain,
  onExit,
}) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === "Escape") onExit?.();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onExit]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onExit}
      />

      <div
        className="
          relative w-[92%] max-w-xl rounded-2xl p-8
          border border-cyan-400/50
          bg-black/70
          shadow-[0_0_35px_rgba(0,234,255,0.35)]
          font-mono text-white
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-pink-400 text-3xl font-extrabold drop-shadow-[0_0_14px_rgba(255,0,230,0.45)]">
            {ui.timeUp}
          </div>
          <div className="text-gray-300 mt-2">{ui.resultsSubtitle}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl p-4 border border-cyan-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">WPM</div>
            <div className="text-cyan-300 text-3xl font-bold">{wpm}</div>
          </div>

          <div className="rounded-xl p-4 border border-pink-500/25 bg-black/40">
            <div className="text-gray-400 text-xs">{ui.accuracy}</div>
            <div className="text-pink-400 text-3xl font-bold">{accuracy}%</div>
          </div>

          <div className="rounded-xl p-4 border border-cyan-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">{ui.correct}</div>
            <div className="text-cyan-200 text-2xl font-bold">{correct}</div>
          </div>

          <div className="rounded-xl p-4 border border-red-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">{ui.mistakes}</div>
            <div className="text-red-300 text-2xl font-bold">{mistakes}</div>
          </div>

          <div className="rounded-xl p-4 border border-cyan-500/30 bg-black/40 col-span-2">
            <div className="text-gray-400 text-xs">{ui.totalKeys}</div>
            <div className="text-white text-2xl font-bold">
              {totalKeys} · {ui.duration}: {durationSec}s
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onAgain}
            className="
              px-6 py-3 rounded-xl font-bold
              border border-cyan-400/60 text-cyan-300
              shadow-[0_0_18px_rgba(0,234,255,0.25)]
              hover:bg-cyan-400/10 transition-all
            "
          >
            {ui.playAgain}
          </button>

          <button
            onClick={onExit}
            className="
              px-6 py-3 rounded-xl font-bold
              border border-pink-500/50 text-pink-400
              shadow-[0_0_18px_rgba(255,0,230,0.18)]
              hover:bg-pink-500/10 transition-all
            "
          >
            {ui.back}
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Esc — {ui.back}
        </div>
      </div>
    </div>
  );
}

export default function RaceAgainstTime() {
  const navigate = useNavigate();
  const { layout, language } = useSettings();

  const isUkMode = language === "uk" && layout === "uk";

  const ui = useMemo(() => {
    if (isUkMode) {
      return {
        gameMode: "РЕЖИМ ГРИ",
        title: "ГОНКА З ЧАСОМ",
        desc: "Перевір свій максимум швидкості. Друкуй без зупинки, доки не закінчиться час.",
        duration: "Тривалість",
        playNow: "Почати",
        timeLeft: "Залишилось часу",
        accuracy: "Точність",
        totalKeys: "Усього натисків",
        reset: "Скинути",
        back: "Назад",
        timeUp: "ЧАС ВИЙШОВ",
        resultsSubtitle: "Класний забіг. Ось результати:",
        correct: "Правильно",
        mistakes: "Помилки",
        playAgain: "Ще раз",
      };
    }
    return {
      gameMode: "GAME MODE",
      title: "RACE AGAINST TIME",
      desc: "Test your raw WPM limit. Type continuously until the timer runs out.",
      duration: "Duration",
      playNow: "Play Now",
      timeLeft: "Time left",
      accuracy: "Accuracy",
      totalKeys: "Total keys",
      reset: "Reset",
      back: "Back",
      timeUp: "TIME’S UP",
      resultsSubtitle: "Nice run. Here are your results:",
      correct: "Correct",
      mistakes: "Mistakes",
      playAgain: "Play Again",
    };
  }, [isUkMode]);

  const allowedCodes = useMemo(() => DEFAULT_ALLOWED_CODES, []);

  const codeToLabel = useMemo(() => buildCodeToLabelMap(), []);
  const labelOf = useCallback(
    (code) => {
      const it = codeToLabel.get(code);
      if (!it) return code;
      return (layout === "uk" ? it.uk : it.en) || code;
    },
    [codeToLabel, layout]
  );

  const [duration, setDuration] = useState(60);

  const [phase, setPhase] = useState("idle"); // "idle" | "running" | "finished"
  const [timeLeft, setTimeLeft] = useState(duration);

  const [currentCode, setCurrentCode] = useState(null);
  const [errorFlash, setErrorFlash] = useState(false);

  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);

  const timerRef = useRef(null);
  const flashRef = useRef(null);
  const savedRef = useRef(false);

  const highlightCodes = useMemo(
    () => (currentCode ? [currentCode] : []),
    [currentCode]
  );

  const reset = useCallback(
    (nextDuration = duration) => {
      setPhase("idle");
      setTimeLeft(nextDuration);

      setCurrentCode(null);
      setErrorFlash(false);

      setCorrect(0);
      setMistakes(0);
      setTotalKeys(0);

      savedRef.current = false;

      if (timerRef.current) window.clearInterval(timerRef.current);
      if (flashRef.current) window.clearTimeout(flashRef.current);
      timerRef.current = null;
      flashRef.current = null;
    },
    [duration]
  );

  const pickNextKey = useCallback(() => {
    const rand = allowedCodes[Math.floor(Math.random() * allowedCodes.length)];
    setCurrentCode(rand);
  }, [allowedCodes]);

  const start = useCallback(() => {
    // важливо: reset + одразу phase=running
    reset(duration);
    setPhase("running");
    setTimeLeft(duration);

    window.setTimeout(() => pickNextKey(), 0);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, pickNextKey, reset]);

  const onKeyDown = useCallback(
    (e) => {
      if (phase !== "running") return;
      if (!currentCode) return;
      if (timeLeft <= 0) return;

      const code = e.code;
      if (!allowedCodes.includes(code)) return;

      setTotalKeys((t) => t + 1);

      if (code === currentCode) {
        setCorrect((c) => c + 1);
        pickNextKey();
      } else {
        setMistakes((m) => m + 1);
        setErrorFlash(true);

        if (flashRef.current) window.clearTimeout(flashRef.current);
        flashRef.current = window.setTimeout(() => setErrorFlash(false), 450);
      }
    },
    [allowedCodes, currentCode, phase, pickNextKey, timeLeft]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const elapsedMs = useMemo(() => {
    if (phase === "idle") return 0;
    const elapsedSec = Math.max(0, duration - timeLeft);
    const finalSec = phase === "finished" ? duration : elapsedSec;
    return finalSec * 1000;
  }, [duration, timeLeft, phase]);

  const minutes = elapsedMs / 60000;
  const wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
  const accuracy = totalKeys > 0 ? Math.round((correct / totalKeys) * 100) : 100;

  useEffect(() => {
    if (phase !== "finished") return;
    if (savedRef.current) return;
    savedRef.current = true;

    addSession({
      mode: "game",
      id: "race_against_time",
      wpm,
      accuracy,
      timeMs: duration * 1000,
      correct,
      mistakes,
      totalKeys,
      createdAt: Date.now(),
    });

    emitStatsUpdate();
  }, [phase, wpm, accuracy, duration, correct, mistakes, totalKeys]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (flashRef.current) window.clearTimeout(flashRef.current);
    };
  }, []);

  const exitToGames = useCallback(() => {
    // щоб не було "зависання" таймерів при переході
    reset(duration);
    navigate("/games");
  }, [navigate, reset, duration]);

  return (
    <div className="min-h-screen p-10 text-white bg-black font-mono">
      <div className="max-w-4xl mx-auto mb-10">
        <div className="text-cyan-300 text-sm tracking-widest opacity-80">
          {ui.gameMode}
        </div>
        <h1 className="text-4xl font-extrabold text-white mt-2">{ui.title}</h1>
        <p className="text-gray-300 mt-3 max-w-2xl">{ui.desc}</p>
      </div>

      {phase === "idle" && (
        <div className="max-w-4xl mx-auto">
          <div
            className="
              rounded-2xl p-10 text-center
              border border-cyan-400/50 bg-black/60
              shadow-[0_0_35px_rgba(0,234,255,0.25)]
            "
          >
            <div className="text-6xl mb-6 text-cyan-300 drop-shadow-[0_0_16px_rgba(0,234,255,0.35)]">
              ⚡
            </div>

            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-gray-300">{ui.duration}</span>
              <select
                value={duration}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setDuration(v);
                  setTimeLeft(v);
                }}
                className="
                  bg-black/50 border border-cyan-400/40
                  rounded-lg px-3 py-2 text-cyan-300
                  outline-none
                "
              >
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={90}>90s</option>
              </select>
            </div>

            <button
              onClick={start}
              className="
                px-10 py-4 rounded-xl text-xl font-bold
                border border-cyan-400/70 text-cyan-300
                shadow-[0_0_20px_rgba(0,234,255,0.35)]
                hover:bg-cyan-400/10 transition-all
                active:scale-95
              "
            >
              {ui.playNow}
            </button>
          </div>
        </div>
      )}

      {phase !== "idle" && (
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="px-5 py-3 rounded-xl border border-cyan-500/30 bg-black/40">
              <div className="text-gray-400 text-xs">{ui.timeLeft}</div>
              <div className="text-cyan-300 text-2xl font-bold">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="px-5 py-3 rounded-xl border border-cyan-500/30 bg-black/40">
              <div className="text-gray-400 text-xs">WPM</div>
              <div className="text-cyan-200 text-2xl font-bold">{wpm}</div>
            </div>

            <div className="px-5 py-3 rounded-xl border border-pink-500/25 bg-black/40">
              <div className="text-gray-400 text-xs">{ui.accuracy}</div>
              <div className="text-pink-400 text-2xl font-bold">{accuracy}%</div>
            </div>

            <div className="px-5 py-3 rounded-xl border border-cyan-500/30 bg-black/40">
              <div className="text-gray-400 text-xs">{ui.totalKeys}</div>
              <div className="text-white text-2xl font-bold">{totalKeys}</div>
            </div>
          </div>

          {phase === "running" && currentCode && (
            <div className="text-6xl mb-8 text-pink-500 font-bold drop-shadow-[0_0_20px_rgba(255,0,230,0.6)]">
              {String(labelOf(currentCode)).toUpperCase()}
            </div>
          )}

          <NeonKeyboard
            showLabels
            layout={layout}
            highlightCodes={highlightCodes}
            allowedCodes={allowedCodes}
            errorFlash={errorFlash}
          />

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => reset(duration)}
              className="
                px-6 py-3 rounded-xl font-bold
                border border-cyan-400/50 text-cyan-300
                hover:bg-cyan-400/10 transition-all
              "
            >
              {ui.reset}
            </button>
            <button
              onClick={exitToGames}
              className="
                px-6 py-3 rounded-xl font-bold
                border border-pink-500/40 text-pink-400
                hover:bg-pink-500/10 transition-all
              "
            >
              {ui.back}
            </button>
          </div>
        </div>
      )}

      <ResultModal
        open={phase === "finished"}
        ui={ui}
        wpm={wpm}
        accuracy={accuracy}
        correct={correct}
        mistakes={mistakes}
        totalKeys={totalKeys}
        durationSec={duration}
        onAgain={() => start()}
        onExit={exitToGames}
      />
    </div>
  );
}
