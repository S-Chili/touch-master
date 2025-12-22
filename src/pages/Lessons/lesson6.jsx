import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

const PUNCT = [",", ".", "/", "'"];

const lesson6Config = {
  id: 6,
  title: "Lesson 6 — Punctuation Basics",
  description: "Typing common symbols like comma, period, question mark, and apostrophe.",
  allowedKeys: PUNCT,
  stages: [
    [","],
    ["."],
    ["/"],
    ["'"],
    PUNCT,
  ],
  reps: 20,
};

export default function Lesson6() {
  return (
    <LessonTemplate title={lesson6Config.title} description={lesson6Config.description}>
      <LessonTrainer config={lesson6Config} />
    </LessonTemplate>
  );
}
