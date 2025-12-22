import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

const BOTTOM_ROW = ["Z", "X", "C", "V", "B", "N", "M"];

const lesson5Config = {
  id: 5,
  title: "Lesson 5 — Bottom Row",
  description: "Practicing the lowest row (Z, X, C, V, M, N) and thumb movement.",
  allowedKeys: BOTTOM_ROW,
  stages: [
    ["Z", "X"],
    ["C", "V"],
    ["B", "N"],
    ["M"],
    BOTTOM_ROW,
  ],
  reps: 20,
};

export default function Lesson5() {
  return (
    <LessonTemplate title={lesson5Config.title} description={lesson5Config.description}>
      <LessonTrainer config={lesson5Config} />
    </LessonTemplate>
  );
}
