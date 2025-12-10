import React, { useState, useEffect, useCallback } from "react";
import LessonTemplate from "./LessonTemplate";
import NeonKeyboard from "../../components/NeonKeyboard.jsx";

const TOP_ROW = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];

const STAGES = [
  TOP_ROW.slice(0, 2),
  TOP_ROW.slice(0, 4),
  TOP_ROW.slice(0, 6),
  TOP_ROW.slice(0, 8),
  TOP_ROW.slice(0, 10),
];

const repsPerStage = 5;

export default function Lesson4() {
  const [stageIndex, setStageIndex] = useState(0);
  const [currentKey, setCurrentKey] = useState(null);
  const [completed, setCompleted] = useState(0);

  const highlightKeys = currentKey ? [currentKey.toLowerCase()] : [];

  const generateNextKey = useCallback(() => {
    const keys = STAGES[stageIndex];
    const random = keys[Math.floor(Math.random() * keys.length)];
    setCurrentKey(random);
  }, [stageIndex]);

  const handleKeyPress = useCallback(
    (e) => {
      if (!currentKey) return;

      if (e.key.toLowerCase() === currentKey.toLowerCase()) {
        setCompleted((prev) => {
          const newCount = prev + 1;

          if (newCount >= repsPerStage) {
            setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
            generateNextKey();
            return 0; 
          }

          generateNextKey();
          return newCount;
        });
      }
    },
    [currentKey, generateNextKey]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

    useEffect(() => {
    const timer = setTimeout(() => {
        generateNextKey(); 
    }, 0);

    return () => clearTimeout(timer);
    }, [stageIndex, generateNextKey]);


  return (
    <LessonTemplate
    >
      <div className="text-center">

        <h2 className="text-2xl font-bold text-pink-400 mb-4">
          Stage {stageIndex + 1} / {STAGES.length}
        </h2>

        <p className="text-gray-300 mb-4">
          Correct presses: {completed} / {repsPerStage}
        </p>

        {currentKey && (
          <div className="text-6xl mb-6 text-pink-500 font-bold drop-shadow-[0_0_20px_rgba(255,0,230,0.5)]">
            {currentKey}
          </div>
        )}

        <NeonKeyboard showLabels={false} highlightKeys={highlightKeys} />
      </div>
    </LessonTemplate>
  );
}
