import React, { useCallback, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";
import { addSession } from "../../data/statsStore";
import { emitStatsUpdate } from "../../data/statsEvents";
import { KEYBOARD_ROWS } from "../../data/keyboardLayouts";
import { useSettings } from "../../context/useSettings";

const ROUNDS_TO_WIN = 12;
const SHOW_MS = 1200;
const BETWEEN_MS = 450;

const SCORE_PER_WORD = 50;
const SCORE_PER_CHAR = 2;
const PENALTY_PER_MISTAKE = 6;

const WORDS_EN = [
  "type", "neon", "maze", "memory", "focus",
  "touch", "shift", "space", "quiet", "rhythm",
  "signal", "cyber", "matrix", "trainer", "keyboard",
  "accuracy", "speed", "future", "shadow", "vector",
];

const WORDS_UK = [
  "мова", "сила", "ріка", "доля", "гора",
  "жито", "літо", "мрія", "зима", "світ",
  "рука", "вікно", "мить", "сова", "вода",
  "мир", "ріки",
];

const DEFAULT_ALLOWED_CODES = [
  "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP",
  "KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL",
  "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM",
];

function fmtTime(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
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

function buildCharToCodeMap() {
  const map = new Map();
  for (const row of KEYBOARD_ROWS) {
    for (const k of row) {
      if (!k.code) continue;
      const en = String(k.labelEn ?? "").toLowerCase();
      const uk = String(k.labelUk ?? "").toLowerCase();
      if (en) map.set(en, k.code);
      if (uk) map.set(uk, k.code);
    }
  }
  return map;
}

function buildWordFromCodes(codes, codeToLabel, layout) {
  return (codes ?? [])
    .map((c) => {
      const it = codeToLabel.get(c);
      const ch = (layout === "uk" ? it?.uk : it?.en) ?? "";
      return String(ch).toLowerCase();
    })
    .join("");
}

function ResultsModal({
  open,
  title,
  description,
  ui,
  score,
  wpm,
  accuracy,
  elapsedMs,
  round,
  roundsToWin,
  mistakes,
  totalKeys,
  onRetry,
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
        className="relative w-[min(720px,92vw)] rounded-2xl border border-cyan-500/40 bg-black/70 p-8
                   shadow-[0_0_40px_rgba(0,234,255,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-extrabold text-purple-300 tracking-widest mb-3">
          {title}
        </h2>
        <p className="text-gray-300 mb-6">{description}</p>

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
            <div className="text-2xl font-bold text-purple-300">{accuracy}%</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">{ui.timeLabel}</div>
            <div className="text-2xl font-bold text-white">{fmtTime(elapsedMs)}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 md:col-span-2">
            <div className="text-gray-400 text-xs">{ui.roundShort}</div>
            <div className="text-2xl font-bold text-cyan-300">
              {round} / {roundsToWin}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">{ui.mistakesShort}</div>
            <div className="text-2xl font-bold text-pink-400">{mistakes}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40">
            <div className="text-gray-400 text-xs">{ui.keysShort}</div>
            <div className="text-2xl font-bold text-white">{totalKeys}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-end">
          <button
            onClick={onRetry}
            className="px-6 py-3 rounded-xl border border-purple-400/60 text-purple-200
                       hover:bg-purple-400/10 transition-all shadow-[0_0_18px_rgba(160,120,255,0.18)]"
          >
            {ui.tryAgain}
          </button>

          <button
            onClick={onExit}
            className="px-6 py-3 rounded-xl border border-cyan-400/60 text-cyan-200
                       hover:bg-cyan-400/10 transition-all shadow-[0_0_18px_rgba(0,234,255,0.18)]"
          >
            {ui.backToGames}
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          Esc — {ui.backToGames}
        </div>
      </div>
    </div>
  );
}

export default function MemoryMaze() {
  const navigate = useNavigate();
  const { layout, language } = useSettings();

  const isUkMode = language === "uk" && layout === "uk";

  const ui = useMemo(
    () => ({
      mode: isUkMode ? "Режим гри" : "Game Mode",
      title: "MEMORY MAZE",
      desc: isUkMode
        ? "Подивись на слово — воно зникне — введи з памʼяті. Enter = підтвердити · Backspace = виправити."
        : "Watch the word, it disappears, then type from memory. Enter = submit · Backspace = fix.",
      round: isUkMode ? "РАУНД" : "ROUND",
      score: "SCORE",
      accuracy: isUkMode ? "ТОЧНІСТЬ" : "ACCURACY",
      wpm: "WPM",
      time: isUkMode ? "Час" : "Time",
      mistakes: isUkMode ? "Помилки" : "Mistakes",
      yourInput: isUkMode ? "Твій ввід:" : "Your input:",
      tipEnter: isUkMode
        ? "Порада: натисни Enter, щоб здати раніше"
        : "Tip: press Enter to submit early",
      pressStart: isUkMode
        ? "Натисни будь-яку дозволену клавішу ⚡"
        : "Press any allowed key to begin ⚡",
      reportTitle: isUkMode ? "ЗВІТ ЛАБІРИНТУ" : "MAZE REPORT",
      reportDesc: isUkMode
        ? "Забіг завершено. Повторити чи повернутися до Games?"
        : "Run complete. Try again or go back to Games?",
      tryAgain: isUkMode ? "Ще раз" : "Try Again",
      backToGames: isUkMode ? "До ігор" : "Back to Games",
      timeLabel: isUkMode ? "ЧАС" : "TIME",

      roundShort: isUkMode ? "РАУНД" : "ROUND",
      mistakesShort: isUkMode ? "ПОМИЛКИ" : "MISTAKES",
      keysShort: isUkMode ? "НАТИСКИ" : "KEYS",
    }),
    [isUkMode]
  );

  const allowedCodes = useMemo(() => DEFAULT_ALLOWED_CODES, []);
  const wordsPool = useMemo(() => (isUkMode ? WORDS_UK : WORDS_EN), [isUkMode]);

  const codeToLabel = useMemo(() => buildCodeToLabelMap(), []);
  const charToCode = useMemo(() => buildCharToCodeMap(), []);

  const pickWord = useCallback(
    (exclude) => {
      const pool = wordsPool.filter((w) => w !== exclude);
      return pool[Math.floor(Math.random() * pool.length)];
    },
    [wordsPool]
  );

  const wordToCodes = useCallback(
    (word) => {
      const chars = String(word).toLowerCase().split("");
      const codes = chars.map((ch) => charToCode.get(ch)).filter(Boolean);
      if (codes.length !== chars.length) return null;
      if (codes.some((c) => !allowedCodes.includes(c))) return null;
      return codes;
    },
    [charToCode, allowedCodes]
  );

  const pickValidTargetCodes = useCallback(
    (excludeWord = null) => {
      let w = pickWord(excludeWord);
      let codes = null;

      for (let i = 0; i < 60; i++) {
        codes = wordToCodes(w);
        if (codes) return { word: w, codes };
        w = pickWord(w);
      }

      const fallbackWord = isUkMode ? "мова" : "type";
      const fallbackCodes =
        wordToCodes(fallbackWord) ?? ["KeyT", "KeyY", "KeyP", "KeyE"];

      return { word: fallbackWord, codes: fallbackCodes };
    },
    [pickWord, wordToCodes, isUkMode]
  );

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [startAtMs, setStartAtMs] = useState(null);
  const [endAtMs, setEndAtMs] = useState(null);
  const [now, setNow] = useState(0);

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("show");

  const [targetCodes, setTargetCodes] = useState(
    () => pickValidTargetCodes(null).codes
  );

  const [typedCodes, setTypedCodes] = useState([]);
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

  const savedRef = useRef(false);

 // reset ONLY when UA/EN mode actually changed AND game is idle (not started, not finished)
const prevModeRef = useRef(isUkMode);

useEffect(() => {
  const modeChanged = prevModeRef.current !== isUkMode;
  prevModeRef.current = isUkMode;

  if (!modeChanged) return;      // не чіпай, якщо режим не змінювався
  if (started) return;           // не чіпай під час гри
  if (finished) return;          // не чіпай після фінішу (щоб модалка не закривалась)

  const { codes } = pickValidTargetCodes(null);

  startTransition(() => {
    setTargetCodes(codes);
    setTypedCodes([]);
    setPhase("show");
    setRound(1);
    setMistakes(0);
    setTotalKeys(0);
    setScore(0);
    setErrorFlash(false);
    setStartAtMs(null);
    setEndAtMs(null);
    setNow(0);
    savedRef.current = false;
  });
}, [isUkMode, started, finished, pickValidTargetCodes]);


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

  const targetWordText = useMemo(() => {
    return buildWordFromCodes(targetCodes, codeToLabel, layout);
  }, [targetCodes, codeToLabel, layout]);

  const typedText = useMemo(() => {
    return buildWordFromCodes(typedCodes, codeToLabel, layout);
  }, [typedCodes, codeToLabel, layout]);

  const nextExpectedCode = useMemo(() => {
    if (phase !== "type") return null;
    const idx = typedCodes.length;
    if (idx >= targetCodes.length) return null;
    return targetCodes[idx];
  }, [phase, typedCodes, targetCodes]);

  const highlightCodes = useMemo(
    () => (nextExpectedCode ? [nextExpectedCode] : []),
    [nextExpectedCode]
  );

  const submitAttempt = useCallback(
    (attemptCodesRaw) => {
      if (phase !== "type") return;

      const attemptCodes = attemptCodesRaw ?? typedCodes;
      const expectedCodes = targetCodes;

      let gained = 0;
      let localMistakes = 0;

      const maxLen = Math.max(expectedCodes.length, attemptCodes.length);

      for (let i = 0; i < maxLen; i++) {
        const a = attemptCodes[i];
        const b = expectedCodes[i];
        if (a && b && a === b) gained += SCORE_PER_CHAR;
        else if (a || b) localMistakes += 1;
      }

      const wordCorrect =
        attemptCodes.length === expectedCodes.length &&
        attemptCodes.every((c, i) => c === expectedCodes[i]);

      if (wordCorrect) gained += SCORE_PER_WORD;

      if (localMistakes > 0) {
        setMistakes((m) => m + localMistakes);
        flashError();
      }

      setScore((s) =>
        Math.max(0, s + gained - (wordCorrect ? 0 : PENALTY_PER_MISTAKE))
      );

      setPhase("result");

      window.setTimeout(() => {
        if (round >= ROUNDS_TO_WIN) {
          setFinished(true);
          setEndAtMs(Date.now());
          setStarted(false);
          return;
        }

        const { codes: nextCodes } = pickValidTargetCodes(null);
        setRound((r) => r + 1);
        setTargetCodes(nextCodes);
        setTypedCodes([]);
        setPhase("show");
      }, BETWEEN_MS);
    },
    [phase, typedCodes, targetCodes, flashError, round, pickValidTargetCodes]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (finished) return;

      const code = e.code;

      if (
        !allowedCodes.includes(code) &&
        code !== "Enter" &&
        code !== "Backspace"
      )
        return;

      if (!started) startIfNeeded();
      if (phase !== "type") return;

      if (code === "Enter") {
        submitAttempt(typedCodes);
        return;
      }

      if (code === "Backspace") {
        setTypedCodes((t) => t.slice(0, -1));
        setTotalKeys((n) => n + 1);
        return;
      }

      if (!allowedCodes.includes(code)) return;

      setTypedCodes((prev) => {
        if (prev.length >= targetCodes.length) return prev;

        const next = [...prev, code];

        if (next.length >= targetCodes.length) {
          window.setTimeout(() => submitAttempt(next), 0);
        }
        return next;
      });

      setTotalKeys((n) => n + 1);
    },
    [
      finished,
      allowedCodes,
      started,
      startIfNeeded,
      phase,
      submitAttempt,
      typedCodes,
      targetCodes.length,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (!finished) return;
    if (savedRef.current) return;
    savedRef.current = true;

    addSession({
      mode: "game",
      id: "memory_maze",
      wpm,
      accuracy,
      timeMs: elapsedMs,
      score,
      correct: round >= ROUNDS_TO_WIN ? ROUNDS_TO_WIN : round,
      mistakes,
      totalKeys,
      createdAt: Date.now(),
    });

    emitStatsUpdate();
  }, [finished, wpm, accuracy, elapsedMs, score, round, mistakes, totalKeys]);

  const resetGame = useCallback(() => {
    setStarted(false);
    setFinished(false);
    setStartAtMs(null);
    setEndAtMs(null);
    savedRef.current = false;

    setNow(0);
    setRound(1);
    setPhase("show");

    const { codes } = pickValidTargetCodes(null);
    setTargetCodes(codes);

    setTypedCodes([]);
    setMistakes(0);
    setTotalKeys(0);
    setScore(0);
    setErrorFlash(false);
  }, [pickValidTargetCodes]);

  const closeModalToGames = useCallback(() => {
    navigate("/games");
  }, [navigate]);

  return (
    <div className="min-h-screen p-10 text-white bg-black font-mono">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-cyan-300/80 mb-2">{ui.mode}</div>
            <h1 className="text-4xl font-extrabold tracking-widest text-purple-400 drop-shadow-[0_0_12px_rgba(160,120,255,0.45)]">
              {ui.title}
            </h1>
            <p className="text-gray-300 mt-3 max-w-2xl">{ui.desc}</p>
          </div>

          <button
            onClick={() => navigate("/games")}
            className="px-4 py-2 rounded-lg border border-cyan-400/50 text-cyan-200 hover:bg-cyan-400/10 transition whitespace-nowrap"
          >
            ← {ui.backToGames}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.round}</div>
            <div className="text-2xl font-bold text-cyan-300">
              {round} / {ROUNDS_TO_WIN}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.score}</div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.accuracy}</div>
            <div className="text-2xl font-bold text-purple-300">{accuracy}%</div>
          </div>

          <div className="p-4 rounded-xl border border-cyan-500/30 bg-black/40 shadow-[0_0_18px_rgba(0,234,255,0.12)]">
            <div className="text-gray-400 text-xs">{ui.wpm}</div>
            <div className="text-2xl font-bold text-cyan-300">{wpm}</div>
          </div>
        </div>

        <div className="text-center mb-8">
          {!started && !finished && (
            <div className="text-cyan-300/80">{ui.pressStart}</div>
          )}

          {started && !finished && (
            <>
              <div className="text-gray-400 mb-2">
                {ui.time}:{" "}
                <span className="text-white font-bold">{fmtTime(elapsedMs)}</span>{" "}
                · {ui.mistakes}:{" "}
                <span className="text-pink-400 font-bold">{mistakes}</span>
              </div>

              {phase === "show" && (
                <div className="text-6xl font-extrabold text-purple-400 drop-shadow-[0_0_22px_rgba(160,120,255,0.55)]">
                  {targetWordText.toUpperCase()}
                </div>
              )}

              {phase !== "show" && (
                <div className="text-4xl font-extrabold text-white/80 tracking-widest">
                  {"•".repeat(targetCodes.length)}
                </div>
              )}

              <div className="mt-5 text-xl">
                <span className="text-gray-400">{ui.yourInput}</span>{" "}
                <span className="text-cyan-300 font-bold">
                  {typedText.toUpperCase() || "…"}
                </span>
              </div>

              {phase === "type" && (
                <div className="mt-2 text-gray-400 text-sm">{ui.tipEnter}</div>
              )}
            </>
          )}
        </div>

        <NeonKeyboard
          showLabels
          layout={layout}
          highlightCodes={highlightCodes}
          allowedCodes={allowedCodes}
          errorFlash={errorFlash}
        />

        <ResultsModal
          open={finished}
          title={ui.reportTitle}
          description={ui.reportDesc}
          ui={ui}
          score={score}
          wpm={wpm}
          accuracy={accuracy}
          elapsedMs={elapsedMs}
          round={round}
          roundsToWin={ROUNDS_TO_WIN}
          mistakes={mistakes}
          totalKeys={totalKeys}
          onRetry={resetGame}
          onExit={closeModalToGames}
        />
      </div>
    </div>
  );
}
