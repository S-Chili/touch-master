import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const lesson8Config = {
  id: 8,
  title: "Lesson 8 — Number Row (Digits)",
  description: "Focus on typing the numbers 1 through 0 without looking.",
  allowedKeys: DIGITS,
  stages: [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0"],
    DIGITS,
  ],
  reps: 20,
};

export default function Lesson8() {
  return (
    <LessonTemplate title={lesson8Config.title} description={lesson8Config.description}>
      <LessonTrainer config={lesson8Config} />
    </LessonTemplate>
  );
}
