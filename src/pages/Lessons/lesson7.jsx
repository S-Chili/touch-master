import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

const CAPS_KEYS = ["A", "S", "D", "F", "J", "K", "L"];

const lesson7Config = {
  id: 7,
  title: "Lesson 7 — Capitalization & Shift Keys",
  description: "Proper use of the Shift keys for capitalization and special characters.",
  allowedKeys: CAPS_KEYS,
  stages: [
    ["A", "S"],
    ["D", "F"],
    ["J", "K"],
    ["L"],
    CAPS_KEYS,
  ],
  reps: 20,
};

export default function Lesson7() {
  return (
    <LessonTemplate title={lesson7Config.title} description={lesson7Config.description}>
      <LessonTrainer config={lesson7Config} />
    </LessonTemplate>
  );
}
