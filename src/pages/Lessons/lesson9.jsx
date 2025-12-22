import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

const SYMBOLS = ["@", "#", "$", "%", "&", "*"];

const lesson9Config = {
  id: 9,
  title: "Lesson 9 — Special Symbols",
  description: "Typing less common symbols using the Shift key (e.g., %, $, &, @).",
  allowedKeys: SYMBOLS,
  stages: [
    ["@", "#"],
    ["$", "%"],
    ["&", "*"],
    SYMBOLS,
  ],
  reps: 20,
};

export default function Lesson9() {
  return (
    <LessonTemplate title={lesson9Config.title} description={lesson9Config.description}>
      <LessonTrainer config={lesson9Config} />
    </LessonTemplate>
  );
}
