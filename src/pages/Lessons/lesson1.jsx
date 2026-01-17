import React, { useMemo } from "react";
import LessonTrainer from "./LessonTrainer";
import { useSettings } from "../../context/useSettings";

export default function Lesson1() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const ui = useMemo(
    () => ({
      title: isUK ? "Урок 1 — Домашній ряд" : "Lesson 1 — Home Row",
      tip: isUK
        ? "Тримай пальці на домашньому ряду. Дивись на екран, не на клавіатуру."
        : "Keep fingers on the home row. Look at the screen, not the keyboard.",
    }),
    [isUK]
  );

  const config = useMemo(
    () => ({
      id: 1,

      allowedCodes: [
        "KeyA",
        "KeyS",
        "KeyD",
        "KeyF",
        "KeyJ",
        "KeyK",
        "KeyL",
        "Semicolon",
        "Quote",
      ],

      stages: [
        ["KeyA", "KeyS", "KeyD", "KeyF"],
        ["KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
        ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
      ],

      reps: 20,
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
