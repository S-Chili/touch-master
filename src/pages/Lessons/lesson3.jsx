import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

// Lesson 3 — додаємо T R O (вихід в top-row)
const BASE = ["A", "S", "D", "F", "J", "K", "L", "E", "I"];
const NEW = ["T", "R", "O"];
const ALLOWED = [...new Set([...BASE, ...NEW])];

const lesson3Config = {
  id: 3,
  title: "Lesson 3 — T, R, and O Keys",
  description: "Introduce T, R, and O. Keep rhythm and accuracy.",
  allowedKeys: ALLOWED,
  stages: [
    ["F", "J"],                 // reset
    ["T", "R"],                 // нові (ліва рука верх)
    ["O", "I"],                 // права верх + опора
    ["T", "R", "E", "D"],       // комбінації (ліва зона)
    ["O", "I", "K", "L"],       // комбінації (права зона)
    ["T", "R", "O", "E", "I"],  // top+near
    ALLOWED,                    // все разом
  ],
  reps: 90,
};

export default function Lesson3() {
  return (
    <LessonTemplate title={lesson3Config.title} description={lesson3Config.description}>
      <LessonTrainer config={lesson3Config} />
    </LessonTemplate>
  );
}
