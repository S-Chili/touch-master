import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";

const ROUNDS_TO_WIN = 12;
const SHOW_MS = 1200;          
const BETWEEN_MS = 450;        
const SCORE_PER_WORD = 50;
const SCORE_PER_CHAR = 2;
const PENALTY_PER_MISTAKE = 6;

const WORDS = [
  "type", "neon", "maze", "memory", "focus",
  "touch", "shift", "space", "quiet", "rhythm",
  "signal", "cyber", "matrix", "trainer", "keyboard",
  "accuracy", "speed", "future", "shadow", "vector",
];

const DEFAULT_ALLOWED = [
  "Q","W","E","R","T","Y","U","I","O","P",
  "A","S","D","F","G","H","J","K","L",
  "Z","X","C","V","B","N","M",
];

function pickWord(exclude) {
  const pool = WORDS.filter((w) => w !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

function fmtTime(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function MemoryMaze() {
  const navigate = useNavigate();

  const allowedKeys = useMemo(() => DEFAULT_ALLOWED, []);
  const allowedLower = useMemo(() => allowedKeys.map(k => k.toLowerCase()), [allowedKeys]);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [startAtMs, setStartAtMs] = useState(null);
  const [endAtMs, setEndAtMs] = useState(null);
  const [now, setNow] = useState(0);

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("show"); // "show" | "type" | "result"
  const [secretWord, setSecretWord] = useState(() => pickWord(null));

  const [typed, setTyped] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [totalKeys, setTotalKeys] = useState(0);
  const [score, setScore] = useState(0);

  const [errorFlash, setErrorFlash] = useState(false);

  const effectiveNow = finished && endAtMs ? endAtMs : now;

  const elapsedMs = useMemo(() => {
    if (!startAtMs) return 0;
    return Math.max(0, effectiveNow - startAtMs);
  }, [effectiveNow, startAtMs]);

  const accuracy = useMemo(() => {
    if (totalKeys === 0) return 100;
    const good = Math.max(0, totalKeys - mistakes);
    return Math.round((good / totalKeys) * 100);
  }, [totalKeys, mistakes]);

  const wpm = useMemo(() => {
    if (!startAtMs) return 0;
    const minutes = elapsedMs / 60000;
    if (minutes <= 0) return 0;
    return Math.round(((totalKeys - mistakes) / 5) / minutes);
  }, [elapsedMs, startAtMs, totalKeys, mistakes]);

  const nextExpected = useMemo(() => {
    if (phase !== "type") return null;
    const idx = typed.length;
    if (idx >= secretWord.length) return null;
    return secretWord[idx].toLowerCase();
  }, [phase, typed, secretWord]);

  const highlightKeys = useMemo(() => {
    if (!nextExpected) return [];
    if (nextExpected === " ") return [];
    return [nextExpected];
  }, [nextExpected]);

  useEffect(() => {
    if (!started || finished) return;
    const t = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(t);
  }, [started, finished]);

  useEffect(() => {
    if (!started || finished) return;
    if (phase !== "show") return;

    const t = window.setTimeout(() => setPhase("type"), SHOW_MS);
    return () => window.clearTimeout(t);
  }, [phase, started, finished]);

  const startIfNeeded = useCallback(() => {
    if (started) return;
    const ts = Date.now();
    setStarted(true);
    setStartAtMs(ts);
    setNow(ts);
  }, [started]);

  const flashError = useCallback(() => {
    setErrorFlash(true);
    window.setTimeout(() => setErrorFlash(false), 450);
  }, []);

    const submitAttempt = useCallback((attemptRaw) => {
    if (phase !== "type") return;

    const attempt = (attemptRaw ?? typed).toLowerCase();
    const expected = secretWord.toLowerCase();

    let gained = 0;
    let localMistakes = 0;

    const maxLen = Math.max(expected.length, attempt.length);

    for (let i = 0; i < maxLen; i++) {
        const a = attempt[i];
        const b = expected[i];

        if (a && b && a === b) gained += SCORE_PER_CHAR;
        else if (a || b) localMistakes += 1;
    }

    const wordCorrect = attempt === expected;
    if (wordCorrect) gained += SCORE_PER_WORD;

    if (localMistakes > 0) {
        setMistakes((m) => m + localMistakes);
        flashError();
    }

    setScore((s) =>
        Math.max(
        0,
        s + gained - (wordCorrect ? 0 : PENALTY_PER_MISTAKE)
        )
    );

    setPhase("result");

    window.setTimeout(() => {
        if (round >= ROUNDS_TO_WIN) {
        setFinished(true);
        setEndAtMs(Date.now());
        setStarted(false);
        return;
        }

        setRound((r) => r + 1);
        setSecretWord((prev) => pickWord(prev));
        setTyped("");
        setPhase("show");
    }, BETWEEN_MS);
    }, [phase, typed, secretWord, round, flashError]);


    const onKeyDown = useCallback(
    (e) => {
        if (finished) return;

        const key = e.key;

        if (!started) startIfNeeded();

        if (phase !== "type") return;

        if (key === "Enter") {
        submitAttempt(typed);
        return;
        }

        if (key === "Backspace") {
        setTyped((t) => t.slice(0, -1));
        setTotalKeys((n) => n + 1);
        return;
        }

        if (key === " ") {
        setTyped((t) => (t.length < secretWord.length ? t + " " : t));
        setTotalKeys((n) => n + 1);
        return;
        }

        const pressed = key?.toLowerCase?.() ?? "";
        if (!allowedLower.includes(pressed)) return;

        setTyped((prev) => {
        if (prev.length >= secretWord.length) return prev;

        const next = prev + pressed;

        if (next.length >= secretWord.length) {
            window.setTimeout(() => submitAttempt(next), 0);
        }

        return next;
        });

        setTotalKeys((n) => n + 1);
    },
    [
        finished,
        started,
        startIfNeeded,
        phase,
        submitAttempt,
        typed,
        secretWord.length,
        allowedLower,
    ]
    );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const resetGame = useCallback(() => {
    setStarted(false);
    setFinished(false);
    setStartAtMs(null);
    setEndAtMs(null);
    setNow(0);

    setRound(1);
    setPhase("show");
    setSecretWord(pickWord(null));

    setTyped("");
    setMistakes(0);
    setTotalKeys(0);
    setScore(0);
    setErrorFlash(false);
  }, []);

  return (
    <div className="min-h-screen p-10 text-white bg-black font-mono">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <div className="text-cyan-300/80 mb-2">Game Mode</div>
          <h1 className="text-4xl font-extrabold tracking-widest text-purple-400 drop-shadow-[0_0_12px_rgba(160,120,255,0.45)]">
            MEMORY MAZE
          </h1>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Watch the word, it disappears, then type from memory.
            <span className="text-cyan-300/80"> Enter</span> = submit · <span className="text-cyan-300/80">Backspace</span> = fix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">ROUND</div>
            <div className="text-2xl font-bold text-cyan-300">{round} / {ROUNDS_TO_WIN}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">SCORE</div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">ACCURACY</div>
            <div className="text-2xl font-bold text-purple-300">{accuracy}%</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">WPM</div>
            <div className="text-2xl font-bold text-cyan-300">{wpm}</div>
          </div>
        </div>

        <div className="text-center mb-8">
          {!started && !finished && (
            <div className="text-cyan-300/80">
              Press any allowed key to begin ⚡
            </div>
          )}

          {started && !finished && (
            <>
              <div className="text-gray-400 mb-2">
                Time: <span className="text-white font-bold">{fmtTime(elapsedMs)}</span> · Mistakes:{" "}
                <span className="text-pink-400 font-bold">{mistakes}</span>
              </div>

              {phase === "show" && (
                <div className="text-6xl font-extrabold text-purple-400 drop-shadow-[0_0_22px_rgba(160,120,255,0.55)]">
                  {secretWord.toUpperCase()}
                </div>
              )}

              {phase !== "show" && (
                <div className="text-4xl font-extrabold text-white/80 tracking-widest">
                  {"•".repeat(secretWord.length)}
                </div>
              )}

              <div className="mt-5 text-xl">
                <span className="text-gray-400">Your input:</span>{" "}
                <span className="text-cyan-300 font-bold">{typed.toUpperCase() || "…"}</span>
              </div>

              {phase === "type" && (
                <div className="mt-2 text-gray-400 text-sm">
                  Tip: press <span className="text-cyan-300 font-bold">Enter</span> to submit early
                </div>
              )}
            </>
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
              <h2 className="text-3xl font-extrabold text-purple-300 tracking-widest mb-3">
                MAZE REPORT
              </h2>
              <p className="text-gray-300 mb-6">
                Run complete. Try again or go back to Games?
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
                  <div className="text-2xl font-bold text-purple-300">{accuracy}%</div>
                </div>
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
                  <div className="text-gray-400 text-xs">TIME</div>
                  <div className="text-2xl font-bold text-white">{fmtTime(elapsedMs)}</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-end">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 rounded-xl border border-purple-400/60 text-purple-200
                             hover:bg-purple-400/10 transition-all shadow-[0_0_18px_rgba(160,120,255,0.18)]"
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
