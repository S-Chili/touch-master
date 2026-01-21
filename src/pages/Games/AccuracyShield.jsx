import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { addSession } from "../../data/statsStore.js";
import { emitStatsUpdate } from "../../data/statsEvents.js";
import { KEYBOARD_ROWS } from "../../data/keyboardLayouts.js";
import { useSettings } from "../../context/useSettings.js";

const DEFAULT_ALLOWED_CODES = [
  "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP",
];

const TARGET_CORRECT = 60;
const BASE_TIME_SEC = 45;
const MISTAKE_PENALTY_SEC = 2;
const SCORE_PENALTY = 8;
const SCORE_PER_CORRECT = 5;

const MIN_WPM_TIME_MS = 3000;

function fmtTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
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

export default function AccuracyShield() {
  const navigate = useNavigate();
  const { layout, language } = useSettings();
  const isUK = language === "uk";

  const ui = useMemo(
    () => ({
      mode: isUK ? "Режим гри" : "Game Mode",
      title: "ACCURACY SHIELD",
      desc: isUK
        ? "Фокус без помилок. Кожна помилка зменшує score і додає штраф по часу. Натисни будь-яку дозволену клавішу, щоб стартувати."
        : "Zero-mistake focus. Every error reduces your score and adds time penalty. Press any allowed key to start.",
      timeLeft: isUK ? "ЗАЛИШОК ЧАСУ" : "TIME LEFT",
      score: "SCORE",
      accuracy: isUK ? "ТОЧНІСТЬ" : "ACCURACY",
      wpm: "WPM",
      target: isUK ? "Ціль" : "Correct target",
      mistakes: isUK ? "Помилки" : "Mistakes",
      pressToStart: isUK ? "Натисни будь-яку дозволену клавішу ⚡" : "Press any allowed key to begin ⚡",
      reportTitle: isUK ? "ЗВІТ" : "SHIELD REPORT",
      reportDesc: isUK
        ? "Результати цього забігу. Повторити чи повернутися до Games?"
        : "Results for this run. Want to try again or go back to Games?",
      tryAgain: isUK ? "Ще раз" : "Try Again",
      backToGames: isUK ? "Назад до Games" : "Back to Games",
      correct: isUK ? "ПРАВИЛЬНО" : "CORRECT",
    }),
    [isUK]
  );

  const codeToLabel = useMemo(() => buildCodeToLabelMap(), []);
  const labelOf = useCallback(
    (code) => {
      const it = codeToLabel.get(code);
      if (!it) return code;
      return (layout === "uk" ? it.uk : it.en) || code;
    },
    [codeToLabel, layout]
  );

  const allowedCodes = useMemo(() => DEFAULT_ALLOWED_CODES, []);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [currentCode, setCurrentCode] = useState(null);

  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);

  const [errorFlash, setErrorFlash] = useState(false);

  const [penaltyMs, setPenaltyMs] = useState(0);
  const [now, setNow] = useState(0);
  const [startAtMs, setStartAtMs] = useState(null);
  const [endAtMs, setEndAtMs] = useState(null);

  const sessionSavedRef = useRef(false);

  const timeLeftMs = useMemo(() => {
    if (!started || !startAtMs) return BASE_TIME_SEC * 1000;
    const elapsed = now - startAtMs;
    const total = BASE_TIME_SEC * 1000 + penaltyMs;
    return total - elapsed;
  }, [started, now, penaltyMs, startAtMs]);

  const accuracy = useMemo(() => {
    const total = correct + mistakes;
    return total === 0 ? 100 : Math.round((correct / total) * 100);
  }, [correct, mistakes]);

  const elapsedMs = useMemo(() => {
    if (!startAtMs) return 0;
    return Math.max(0, now - startAtMs);
  }, [now, startAtMs]);

  const wpm = useMemo(() => {
    if (!startAtMs) return 0;
    if (elapsedMs < MIN_WPM_TIME_MS) return 0;
    const minutes = elapsedMs / 60000;
    if (minutes <= 0) return 0;
    return Math.round((correct / 5) / minutes);
  }, [startAtMs, elapsedMs, correct]);

  const highlightCodes = useMemo(() => (currentCode ? [currentCode] : []), [currentCode]);

  const pickNextKey = useCallback(() => {
    const r = Math.floor(Math.random() * allowedCodes.length);
    setCurrentCode(allowedCodes[r]);
  }, [allowedCodes]);

  const finishGame = useCallback(() => {
    const ts = Date.now();
    setFinished((prev) => (prev ? prev : true));
    setEndAtMs(ts);
    setStarted(false);
  }, []);

  const resetGame = useCallback(() => {
    setStarted(false);
    setFinished(false);
    setCurrentCode(null);
    setCorrect(0);
    setMistakes(0);
    setScore(0);
    setPenaltyMs(0);
    setStartAtMs(null);
    setEndAtMs(null);
    setNow(0);
    sessionSavedRef.current = false;
  }, []);

  useEffect(() => {
    if (!started || finished) return;

    const t = window.setInterval(() => {
      const ts = Date.now();
      setNow(ts);

      if (startAtMs) {
        const elapsed = ts - startAtMs;
        const total = BASE_TIME_SEC * 1000 + penaltyMs;
        if (total - elapsed <= 0) {
          finishGame();
          return;
        }
      }

      if (correct >= TARGET_CORRECT) {
        finishGame();
      }
    }, 100);

    return () => window.clearInterval(t);
  }, [started, finished, startAtMs, penaltyMs, correct, finishGame]);

  useEffect(() => {
    if (!started || finished) return;
    if (!currentCode) {
      const t = window.setTimeout(() => pickNextKey(), 0);
      return () => window.clearTimeout(t);
    }
  }, [started, finished, currentCode, pickNextKey]);

  const onKeyDown = useCallback(
    (e) => {
      if (finished) return;

      const pressedCode = e.code;
      if (!allowedCodes.includes(pressedCode)) return;

      if (!started) {
        setStarted(true);
        const ts = Date.now();
        setStartAtMs(ts);
        setNow(ts);

        if (!currentCode) {
          const k = allowedCodes[Math.floor(Math.random() * allowedCodes.length)];
          setCurrentCode(k);
        }
        return;
      }

      if (!currentCode) return;

      if (pressedCode === currentCode) {
        setCorrect((c) => c + 1);
        setScore((s) => s + SCORE_PER_CORRECT);
        pickNextKey();
      } else {
        setMistakes((m) => m + 1);
        setScore((s) => Math.max(0, s - SCORE_PENALTY));
        setPenaltyMs((p) => p + MISTAKE_PENALTY_SEC * 1000);

        setErrorFlash(true);
        window.setTimeout(() => setErrorFlash(false), 450);
      }
    },
    [finished, allowedCodes, started, currentCode, pickNextKey]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (!finished) return;
    if (!startAtMs) return;
    if (sessionSavedRef.current) return;

    sessionSavedRef.current = true;

    const endedAt = endAtMs ?? Date.now();
    const durationMs = Math.max(0, endedAt - startAtMs);

    addSession({
      mode: "game",
      id: "accuracy_shield",
      wpm,
      accuracy,
      timeMs: elapsedMs,
      correct,
      mistakes,
      endedAt,
      durationMs,
      score,
      createdAt: Date.now(),
    });

    emitStatsUpdate();
  }, [finished, wpm, accuracy, elapsedMs, correct, mistakes, score, startAtMs, endAtMs]);

  return (
    <div className="min-h-screen p-10 text-white bg-black font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="text-cyan-300/80 mb-2">{ui.mode}</div>
          <h1 className="text-4xl font-extrabold tracking-widest text-pink-400 drop-shadow-[0_0_12px_rgba(255,0,230,0.45)]">
            {ui.title}
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl">{ui.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.timeLeft}</div>
            <div className="text-2xl font-bold text-cyan-300">{fmtTime(timeLeftMs)}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.score}</div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.accuracy}</div>
            <div className="text-2xl font-bold text-pink-400">{accuracy}%</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.wpm}</div>
            <div className="text-2xl font-bold text-cyan-300">{wpm}</div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-gray-400 mb-3">
            {ui.target}: <span className="text-white font-bold">{correct}</span> / {TARGET_CORRECT} · {ui.mistakes}:{" "}
            <span className="text-pink-400 font-bold">{mistakes}</span>
          </div>

          {currentCode && !finished && (
            <div className="text-7xl font-extrabold text-pink-500 drop-shadow-[0_0_22px_rgba(255,0,230,0.55)]">
              {labelOf(currentCode)}
            </div>
          )}

          {!started && !finished && <div className="mt-4 text-cyan-300/80">{ui.pressToStart}</div>}
        </div>

        <NeonKeyboard
          showLabels
          layout={layout}
          highlightCodes={highlightCodes}
          allowedCodes={allowedCodes}
          errorFlash={errorFlash}
        />

        {finished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div
              className="relative w-[min(720px,92vw)] rounded-2xl border border-cyan-500/40 bg-black/70 p-8
                         shadow-[0_0_40px_rgba(0,234,255,0.25)]"
            >
              <h2 className="text-3xl font-extrabold text-pink-400 tracking-widest mb-3">{ui.reportTitle}</h2>
              <p className="text-gray-300 mb-6">{ui.reportDesc}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">{ui.score}</div>
                  <div className="text-2xl font-bold text-white">{score}</div>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">{ui.wpm}</div>
                  <div className="text-2xl font-bold text-cyan-300">{wpm}</div>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">{ui.accuracy}</div>
                  <div className="text-2xl font-bold text-pink-400">{accuracy}%</div>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">{ui.correct}</div>
                  <div className="text-2xl font-bold text-white">{correct}</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-end">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 rounded-xl border border-pink-500/60 text-pink-300
                             hover:bg-pink-500/10 transition-all shadow-[0_0_18px_rgba(255,0,230,0.18)]"
                >
                  {ui.tryAgain}
                </button>

                <button
                  onClick={() => navigate("/games")}
                  className="px-6 py-3 rounded-xl border border-cyan-400/60 text-cyan-200
                             hover:bg-cyan-400/10 transition-all shadow-[0_0_18px_rgba(0,234,255,0.18)]"
                >
                  {ui.backToGames}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
