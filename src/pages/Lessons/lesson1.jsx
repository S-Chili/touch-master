import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

// Lesson 1 — Home Row (базові клавіші)
const HOME_ROW = ["A", "S", "D", "F", "J", "K", "L"];

const lesson1Config = {
  id: 1,
  title: "Lesson 1 — Home Row Mastery",
  description: "Start with home row keys. Focus on accuracy first, then speed.",
  allowedKeys: HOME_ROW,
  stages: [
    ["F", "J"],                 // старт: опорні
    ["D", "K", "F", "J"],        // додаємо сусідів
    ["S", "L", "D", "K"],        // ще ширше
    ["A", "S", "D", "F"],        // ліва рука
    ["J", "K", "L"],             // права рука
    HOME_ROW,                    // весь home-row
  ],
  reps: 50, // по твоєму плану: урок 1 = 50 натисків (але це per stage; якщо треба total — скажеш, переробимо)
};

export default function Lesson1() {
  return (
    <LessonTemplate title={lesson1Config.title} description={lesson1Config.description}>
      <LessonTrainer config={lesson1Config} />
    </LessonTemplate>
  );
}
