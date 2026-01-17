import React, { useMemo } from "react";
import LessonTrainer from "./LessonTrainer.jsx";
import { useSettings } from "../../context/useSettings";

export default function Lesson2() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const ui = useMemo(
    () => ({
      title: isUK ? "Урок 2 — Верхній ряд" : "Lesson 2 — Top Row",
      tip: isUK
        ? "Тренуйся не поспішаючи, зосереджуючись на точності."
        : "Practice slowly, focusing on accuracy.",
    }),
    [isUK]
  );

  const config = useMemo(
    () => ({
      id: 2,

      allowedCodes: [
        "KeyQ",
        "KeyW",
        "KeyE",
        "KeyR",
        "KeyT",
        "KeyY",
        "KeyU",
        "KeyI",
        "KeyO",
        "KeyP",
        "BracketLeft",
        "BracketRight",
      ],
      
      stages: [
        ["KeyR", "KeyU", "KeyQ", "KeyP"],
        ["KeyT", "KeyE", "KeyY", "KeyI", "BracketLeft"],
        ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
      ],

      reps: 30,
      ui,
    }),
    [ui]
  );

  return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-2">{ui.title}</h1>
        <p className="text-gray-400 mb-6">{ui.tip}</p>
  
        <LessonTrainer config={config} />
      </div>
    );
}
