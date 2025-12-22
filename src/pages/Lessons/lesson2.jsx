import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

// Lesson 2 — додаємо E та I (плюс опорні з home row)
const BASE = ["F", "J", "D", "K", "S", "L", "A"];
const NEW = ["E", "I"];
const ALLOWED = [...new Set([...BASE, ...NEW])];

const lesson2Config = {
  id: 2,
  title: "Lesson 2 — E and I Keys",
  description: "Add E and I while keeping home row stable.",
  allowedKeys: ALLOWED,
  stages: [
    ["F", "J"],                       // швидкий розігрів
    ["E", "I"],                       // нові
    ["E", "F", "I", "J"],             // зв’язки
    ["D", "K", "E", "I"],             // ще комбо
    ["S", "L", "E", "I"],             // розширення
    ALLOWED,                          // все разом
  ],
  reps: 70,
};

export default function Lesson2() {
  return (
    <LessonTemplate title={lesson2Config.title} description={lesson2Config.description}>
      <LessonTrainer config={lesson2Config} />
    </LessonTemplate>
  );
}
