import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";

export default function LessonTrainer({ config }) {
  const { allowedKeys, stages, reps } = config;
  const navigate = useNavigate();

  const [stageIndex, setStageIndex] = useState(0);
  const [currentKey, setCurrentKey] = useState(null);

  const [completed, setCompleted] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [progress, setProgress] = useState(0);
  const [keyboardErrorFlash, setKeyboardErrorFlash] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [correctPresses, setCorrectPresses] = useState(0);

  const highlightKeys = currentKey ? [currentKey.toLowerCase()] : [];

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  const generateNextKey = useCallback(() => {
    const keys = stages[stageIndex];
    if (!keys?.length) return;
    const random = keys[Math.floor(Math.random() * keys.length)];
    setCurrentKey(random);
  }, [stageIndex, stages]);

  const handleKeyPress = useCallback(
    (e) => {
      if (lessonFinished) return;
      if (!currentKey) return;

      const pressed = e.key.toLowerCase();
      const needed = currentKey.toLowerCase();

      const percentPerPress = 20 / reps;

      if (!startTime && pressed === needed) {
        setStartTime(Date.now());
      }

      if (pressed === needed) {
        setCorrectPresses((c) => c + 1);
        setProgress((p) => p + percentPerPress);

        setCompleted((prev) => {
          const newCount = prev + 1;

          if (stageIndex === stages.length - 1 && newCount >= reps) {
            setLessonFinished(true);
            return 0;
          }

          if (newCount >= reps) {
            setStageIndex((idx) => Math.min(idx + 1, stages.length - 1));
            return 0;
          }

          return newCount;
        });

        generateNextKey();
      } else {
        setMistakes((m) => m + 1);
        setProgress((p) => Math.max(0, p - percentPerPress));

        setKeyboardErrorFlash(true);
        setTimeout(() => setKeyboardErrorFlash(false), 500);
      }
    },
    [currentKey, reps, lessonFinished, stageIndex, stages.length, generateNextKey, startTime]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const t = setTimeout(() => {
      generateNextKey();
    }, 0);
    return () => clearTimeout(t);
  }, [stageIndex, generateNextKey]);

  const minutes = elapsedMs / 60000;

  const wpm =
    minutes > 0 ? Math.round((correctPresses / 5) / minutes) : 0;

  const accuracy =
    correctPresses + mistakes > 0
      ? Math.round((correctPresses / (correctPresses + mistakes)) * 100)
      : 100;

  const total = Math.round(progress);
  const timeSeconds = Math.round(elapsedMs / 1000);

  const resetLesson = () => {
    setStageIndex(0);
    setCompleted(0);
    setMistakes(0);
    setProgress(0);
    setStartTime(null);
    setElapsedMs(0);
    setCorrectPresses(0);
    setLessonFinished(false);
    generateNextKey();
  };

  if (lessonFinished) {
    const passed = total >= 99;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 px-6">

        <div className="
          bg-[#0a0c11] border border-cyan-400 rounded-2xl p-10 
          shadow-[0_0_35px_rgba(0,255,255,0.4)] max-w-xl w-full text-center
        ">

          <h2 className="text-4xl font-extrabold text-pink-500 drop-shadow-[0_0_12px_rgba(255,0,230,0.5)] mb-6">
            {passed ? "🎉 Вітаємо! Урок пройдено!" : "⚠️ Спробуйте ще раз!"}
          </h2>

          <div className="text-lg text-cyan-300 space-y-2 mb-8 font-mono">
            <p>Total: <span className="text-white font-bold">{total}%</span></p>
            <p>WPM: <span className="text-white font-bold">{wpm}</span></p>
            <p>Accuracy: <span className="text-white font-bold">{accuracy}%</span></p>
            <p>Time: <span className="text-white font-bold">{timeSeconds}s</span></p>
          </div>

          <div className="flex flex-col gap-4">
            {passed ? (
              <button
                onClick={() => navigate("/lessons")}
                className="py-3 text-xl rounded-lg border border-cyan-400 text-cyan-300 
                hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)]"
              >
                OK
              </button>
            ) : (
              <>
                <button
                  onClick={resetLesson}
                  className="py-3 text-xl rounded-lg border border-pink-500 text-pink-400
                  hover:bg-pink-500 hover:text-black transition-all shadow-[0_0_15px_rgba(255,0,230,0.4)]"
                >
                  Пройти ще раз
                </button>

                <button
                  onClick={() => navigate("/lessons")}
                  className="py-3 text-xl rounded-lg border border-cyan-400 text-cyan-300
                  hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                >
                  Вихід
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-pink-400 mb-4">
        Stage {stageIndex + 1} / {stages.length}
      </h2>

      <p className="text-gray-300 mb-2 text-lg">
        Correct presses: {completed} / {reps}
      </p>

      <p className="text-cyan-300 mb-4 font-bold text-xl">
        Total: {total}%
      </p>

      <div className="flex justify-center gap-10 text-xl mb-6 font-bold">
        <div className="text-cyan-400">WPM: {wpm}</div>
        <div className="text-pink-400">Accuracy: {accuracy}%</div>
      </div>

      {currentKey && (
        <div className="text-6xl mb-6 text-pink-500 font-bold drop-shadow-[0_0_20px_rgba(255,0,230,0.6)]">
          {currentKey}
        </div>
      )}

      <div className={keyboardErrorFlash ? "scale-[1.02] transition-all" : ""}>
        <NeonKeyboard
          showLabels={false}
          highlightKeys={highlightKeys}
          allowedKeys={allowedKeys}
          errorFlash={keyboardErrorFlash}
        />
      </div>
    </div>
  );
}
