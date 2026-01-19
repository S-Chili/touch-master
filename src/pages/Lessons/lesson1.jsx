import React, { useMemo } from "react";
import LessonTrainer from "./LessonTrainer";
import { useSettings } from "../../context/useSettings";
import lessons from "../../data/lessonData";

export default function Lesson1() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const lesson = useMemo(
    () => lessons.find((l) => l.id === 1),
    []
  );

  const title = isUK ? lesson?.titleUk : lesson?.titleEn;
  const description = isUK ? lesson?.descriptionUk : lesson?.descriptionEn;

  const config = useMemo(
    () => ({
      id: 1,

      stages: [
        ["KeyJ", "KeyF"],
        ["KeyJ", "KeyK", "KeyD", "KeyF"],
        ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL"],
      ],

      reps: 20,
    }),
    []
  );

  if (!lesson) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{description}</p>

      <LessonTrainer config={config} />
    </div>
  );
}
