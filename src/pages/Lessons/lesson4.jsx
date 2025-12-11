import React from "react";
import LessonTemplate from "./LessonTemplate.jsx";
import LessonTrainer from "./LessonTrainer.jsx";
import { lessonConfigs } from "../../data/lessonConfigs";

const TOP_ROW = ["Q","W","E","R","T","Y","U","I","O","P"];

const lesson4Config = {
 id: 4,
  title: "Lesson 4 — W and P Keys",
  description: "Training the W and P keys with increasing difficulty.",
  allowedKeys: ["W", "P", "Q", "E", "R", "T", "Y", "U", "I", "O"],
  stages: [
    ["Q", "P", "W", "O"],
    ["E", "I", "R", "U"],
    ["T", "Y"],
    ["Q", "T", "P", "Y"],
    TOP_ROW,
  ],
  reps: lessonConfigs[4], 
};

export default function Lesson4() {
  return (
    <LessonTemplate title={lesson4Config.title} description={lesson4Config.description}>
      <LessonTrainer config={lesson4Config} />
    </LessonTemplate>
  );
}
