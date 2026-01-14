import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { addSession } from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";

const DEFAULT_ALLOWED = ["Q","W","E","R","T","Y","U","I","O","P"];
const TARGET_CORRECT = 60;
const BASE_TIME_SEC = 45;
const MISTAKE_PENALTY_SEC = 2;
const SCORE_PENALTY = 8;
const SCORE_PER_CORRECT = 5;

function fmtTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function AccuracyShield() {
  const navigate = useNavigate();

  const allowedKeys = useMemo(() => DEFAULT_ALLOWED, []);
  const allowedLower = useMemo(() => allowedKeys.map(k => k.toLowerCase()), [allowedKeys]);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [currentKey, setCurrentKey] = useState(null);

  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);

  const [errorFlash, setErrorFlash] = useState(false);

  const [penaltyMs, setPenaltyMs] = useState(0);
  const [now, setNow] = useState(0);
  const [startAtMs, setStartAtMs] = useState(null);
  const [endAtMs, setEndAtMs] = useState(null);


  const MIN_WPM_TIME_MS = 3000;

  // ✅ щоб не записати сесію двічі
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

  const highlightKeys = currentKey ? [currentKey.toLowerCase()] : [];

  const pickNextKey = useCallback(() => {
    const r = Math.floor(Math.random() * allowedKeys.length);
    setCurrentKey(allowedKeys[r]);
  }, [allowedKeys]);

  const finishGame = useCallback(() => {
  const ts = Date.now();

  setFinished((prev) => {
    if (prev) return prev;
    return true;
  });

  setEndAtMs(ts);
  setStarted(false);
}, []);


  const resetGame = useCallback(() => {
  setStarted(false);
  setFinished(false);
  setCurrentKey(null);
  setCorrect(0);
  setMistakes(0);
  setScore(0);
  setPenaltyMs(0);
  setStartAtMs(null);
  setEndAtMs(null);
  setNow(0);
  sessionSavedRef.current = false;
}, []);


  // ticker + finish checks (всередині interval)
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

  // init key after start
  useEffect(() => {
    if (!started || finished) return;
    if (!currentKey) {
      const t = window.setTimeout(() => pickNextKey(), 0);
      return () => window.clearTimeout(t);
    }
  }, [started, finished, currentKey, pickNextKey]);

  const onKeyDown = useCallback((e) => {
    if (finished) return;

    const pressed = e.key?.toLowerCase?.() ?? "";
    if (!allowedLower.includes(pressed)) return;

    if (!started) {
      setStarted(true);
      const ts = Date.now();
      setStartAtMs(ts);
      setNow(ts);

      if (!currentKey) {
        const k = allowedKeys[Math.floor(Math.random() * allowedKeys.length)];
        setCurrentKey(k);
      }
      return;
    }

    if (!currentKey) return;

    const needed = currentKey.toLowerCase();

    if (pressed === needed) {
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
  }, [finished, allowedLower, started, currentKey, allowedKeys, pickNextKey]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // ✅ запис у статистику коли гра завершилась
useEffect(() => {
  if (!finished) return;
  if (!startAtMs) return;
  if (sessionSavedRef.current) return;

  sessionSavedRef.current = true;

  const endedAt = endAtMs ?? Date.now();
  const durationMs = Math.max(0, endedAt - startAtMs);

   addSession({
    mode: "game",                 // <-- критично, інакше normalize зробить lesson:contentReference[oaicite:3]{index=3}
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

  emitStatsUpdate(); // <-- без цього useStats не оновиться:contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}
}, [finished, wpm, accuracy, elapsedMs, correct, mistakes, score, startAtMs, endAtMs]);


  return (
    <div className="min-h-screen p-10 text-white bg-black font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="text-cyan-300/80 mb-2">Game Mode</div>
          <h1 className="text-4xl font-extrabold tracking-widest text-pink-400 drop-shadow-[0_0_12px_rgba(255,0,230,0.45)]">
            ACCURACY SHIELD
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Zero-mistake focus. Every error reduces your score and adds time penalty.
            Press any allowed key to start.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">TIME LEFT</div>
            <div className="text-2xl font-bold text-cyan-300">{fmtTime(timeLeftMs)}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">SCORE</div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">ACCURACY</div>
            <div className="text-2xl font-bold text-pink-400">{accuracy}%</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">WPM</div>
            <div className="text-2xl font-bold text-cyan-300">{wpm}</div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-gray-400 mb-3">
            Correct target: <span className="text-white font-bold">{correct}</span> / {TARGET_CORRECT} · Mistakes:{" "}
            <span className="text-pink-400 font-bold">{mistakes}</span>
          </div>

          {currentKey && !finished && (
            <div className="text-7xl font-extrabold text-pink-500 drop-shadow-[0_0_22px_rgba(255,0,230,0.55)]">
              {currentKey}
            </div>
          )}

          {!started && !finished && (
            <div className="mt-4 text-cyan-300/80">
              Press any allowed key to begin ⚡
            </div>
          )}
        </div>

        <NeonKeyboard
          showLabels={true}
          highlightKeys={highlightKeys}
          allowedKeys={allowedKeys}
          errorFlash={errorFlash}
        />

        {finished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <div className="relative w-[min(720px,92vw)] rounded-2xl border border-cyan-500/40 bg-black/70 p-8
                            shadow-[0_0_40px_rgba(0,234,255,0.25)]">
              <h2 className="text-3xl font-extrabold text-pink-400 tracking-widest mb-3">
                SHIELD REPORT
              </h2>
              <p className="text-gray-300 mb-6">
                Results for this run. Want to try again or go back to Games?
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">SCORE</div>
                  <div className="text-2xl font-bold text-white">{score}</div>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">WPM</div>
                  <div className="text-2xl font-bold text-cyan-300">{wpm}</div>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">ACCURACY</div>
                  <div className="text-2xl font-bold text-pink-400">{accuracy}%</div>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">CORRECT</div>
                  <div className="text-2xl font-bold text-white">{correct}</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-end">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 rounded-xl border border-pink-500/60 text-pink-300
                             hover:bg-pink-500/10 transition-all shadow-[0_0_18px_rgba(255,0,230,0.18)]"
                >
                  Try Again
                </button>

                <button
                  onClick={() => navigate("/games")}
                  className="px-6 py-3 rounded-xl border border-cyan-400/60 text-cyan-200
                             hover:bg-cyan-400/10 transition-all shadow-[0_0_18px_rgba(0,234,255,0.18)]"
                >
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
