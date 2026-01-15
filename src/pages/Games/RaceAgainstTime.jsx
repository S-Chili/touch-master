import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { addSession } from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";

const DEFAULT_ALLOWED = [
  "Q","W","E","R","T","Y","U","I","O","P",
  "A","S","D","F","G","H","J","K","L",
  "Z","X","C","V","B","N","M",
];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function RaceAgainstTime() {
  const navigate = useNavigate();

  const [duration, setDuration] = useState(60);
  const allowedKeys = useMemo(() => DEFAULT_ALLOWED, []);
  const allowedLower = useMemo(
    () => allowedKeys.map((k) => k.toLowerCase()),
    [allowedKeys]
  );

  const [phase, setPhase] = useState("idle"); 
  const [timeLeft, setTimeLeft] = useState(duration);

  const [currentKey, setCurrentKey] = useState(null);
  const [errorFlash, setErrorFlash] = useState(false);

  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [total, setTotal] = useState(0);

  const timerRef = useRef(null);
  const flashRef = useRef(null);

  const savedRef = useRef(false);

  const highlightKeys = currentKey ? [currentKey.toLowerCase()] : [];

  const reset = useCallback(
    (nextDuration = duration) => {
      setPhase("idle");
      setDuration(nextDuration);
      setTimeLeft(nextDuration);

      setCurrentKey(null);
      setErrorFlash(false);

      setCorrect(0);
      setMistakes(0);
      setTotal(0);

      savedRef.current = false;

      if (timerRef.current) window.clearInterval(timerRef.current);
      if (flashRef.current) window.clearTimeout(flashRef.current);
      timerRef.current = null;
      flashRef.current = null;
    },
    [duration]
  );

  const pickNextKey = useCallback(() => {
    const rand = allowedKeys[Math.floor(Math.random() * allowedKeys.length)];
    setCurrentKey(rand);
  }, [allowedKeys]);

  const start = useCallback(() => {
    reset(duration);
    setPhase("running");
    setTimeLeft(duration);

    const t = window.setTimeout(() => pickNextKey(), 0);

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

    return () => window.clearTimeout(t);
  }, [duration, pickNextKey, reset]);

  const onKeyDown = useCallback(
    (e) => {
      if (phase !== "running") return;
      if (!currentKey) return;
      if (timeLeft <= 0) return;

      const pressed = e.key.toLowerCase();
      if (!allowedLower.includes(pressed)) return;

      setTotal((t) => t + 1);

      const needed = currentKey.toLowerCase();
      if (pressed === needed) {
        setCorrect((c) => c + 1);
        pickNextKey();
      } else {
        setMistakes((m) => m + 1);
        setErrorFlash(true);

        if (flashRef.current) window.clearTimeout(flashRef.current);
        flashRef.current = window.setTimeout(() => setErrorFlash(false), 450);
      }
    },
    [allowedLower, currentKey, phase, pickNextKey, timeLeft]
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

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

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
      totalKeys: total,
      createdAt: Date.now(),
    });

    emitStatsUpdate();
  }, [phase, wpm, accuracy, duration, correct, mistakes, total]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (flashRef.current) window.clearTimeout(flashRef.current);
    };
  }, []);

  const ResultModal = ({ onAgain, onExit }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="
          relative w-[92%] max-w-xl rounded-2xl p-8
          border border-cyan-400/50
          bg-black/70
          shadow-[0_0_35px_rgba(0,234,255,0.35)]
          font-mono text-white
        "
      >
        <div className="text-center mb-6">
          <div className="text-pink-400 text-3xl font-extrabold drop-shadow-[0_0_14px_rgba(255,0,230,0.45)]">
            TIME’S UP
          </div>
          <div className="text-gray-300 mt-2">Nice run. Here are your results:</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl p-4 border border-cyan-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">WPM</div>
            <div className="text-cyan-300 text-3xl font-bold">{wpm}</div>
          </div>

          <div className="rounded-xl p-4 border border-pink-500/25 bg-black/40">
            <div className="text-gray-400 text-xs">Accuracy</div>
            <div className="text-pink-400 text-3xl font-bold">{accuracy}%</div>
          </div>

          <div className="rounded-xl p-4 border border-cyan-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">Correct</div>
            <div className="text-cyan-200 text-2xl font-bold">{correct}</div>
          </div>

          <div className="rounded-xl p-4 border border-red-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">Mistakes</div>
            <div className="text-red-300 text-2xl font-bold">{mistakes}</div>
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
            Play Again
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
            Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-10 text-white bg-black font-mono">
      <div className="max-w-4xl mx-auto mb-10">
        <div className="text-cyan-300 text-sm tracking-widest opacity-80">GAME MODE</div>
        <h1 className="text-4xl font-extrabold text-white mt-2">RACE AGAINST TIME</h1>
        <p className="text-gray-300 mt-3 max-w-2xl">
          Test your raw WPM limit. Type continuously until the timer runs out.
        </p>
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
              <span className="text-gray-300">Duration</span>
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
              Play Now
            </button>
          </div>
        </div>
      )}

      {phase !== "idle" && (
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="px-5 py-3 rounded-xl border border-cyan-500/30 bg-black/40">
              <div className="text-gray-400 text-xs">Time left</div>
              <div className="text-cyan-300 text-2xl font-bold">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="px-5 py-3 rounded-xl border border-cyan-500/30 bg-black/40">
              <div className="text-gray-400 text-xs">WPM</div>
              <div className="text-cyan-200 text-2xl font-bold">{wpm}</div>
            </div>

            <div className="px-5 py-3 rounded-xl border border-pink-500/25 bg-black/40">
              <div className="text-gray-400 text-xs">Accuracy</div>
              <div className="text-pink-400 text-2xl font-bold">{accuracy}%</div>
            </div>

            <div className="px-5 py-3 rounded-xl border border-cyan-500/30 bg-black/40">
              <div className="text-gray-400 text-xs">Total keys</div>
              <div className="text-white text-2xl font-bold">{total}</div>
            </div>
          </div>

          {phase === "running" && currentKey && (
            <div className="text-6xl mb-8 text-pink-500 font-bold drop-shadow-[0_0_20px_rgba(255,0,230,0.6)]">
              {currentKey}
            </div>
          )}

          <NeonKeyboard
            showLabels={true}
            highlightKeys={highlightKeys}
            allowedKeys={allowedKeys}
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
              Reset
            </button>
            <button
              onClick={() => navigate("/games")}
              className="
                px-6 py-3 rounded-xl font-bold
                border border-pink-500/40 text-pink-400
                hover:bg-pink-500/10 transition-all
              "
            >
              Back
            </button>
          </div>
        </div>
      )}

      {phase === "finished" && (
        // eslint-disable-next-line react-hooks/static-components
        <ResultModal onAgain={() => start()} onExit={() => navigate("/games")} />
      )}
    </div>
  );
}
