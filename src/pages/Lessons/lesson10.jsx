import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";

const TOP = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const HOME = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const BOTTOM = ["Z", "X", "C", "V", "B", "N", "M"];
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const PUNCT = [",", ".", "/", "'"];

const ALL = [...TOP, ...HOME, ...BOTTOM, ...DIGITS, ...PUNCT];

const lesson10Config = {
  id: 10,
  title: "Lesson 10 — Speed and Endurance Test",
  description:
    "Final comprehensive test combining all rows and symbols for speed and accuracy.",
  allowedKeys: ALL,
  stages: [
    TOP,
    HOME,
    BOTTOM,
    DIGITS,
    PUNCT,
    ALL,
  ],
  reps: 20,
};

export default function Lesson10() {
  return (
    <LessonTemplate title={lesson10Config.title} description={lesson10Config.description}>
      <LessonTrainer config={lesson10Config} />
    </LessonTemplate>
  );
}
