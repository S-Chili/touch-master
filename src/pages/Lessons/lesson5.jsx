import React, { useMemo } from "react";
import LessonTrainer from "./LessonTrainer";
import { useSettings } from "../../context/useSettings";
import lessons from "../../data/lessonData";

export default function Lesson5() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const lesson = useMemo(
    () => lessons.find((l) => l.id === 5),
    []
  );

  const title = isUK ? lesson?.titleUk : lesson?.titleEn;
  const description = isUK ? lesson?.descriptionUk : lesson?.descriptionEn;

  const config = useMemo(
    () => ({
      id: 5,

      stages: [
        ["KeyV", "KeyN"],
        ["KeyV", "KeyN", "KeyM", "KeyC"],
        [
          "KeyV",
          "KeyN",
          "KeyM",
          "KeyC",
          "KeyD",
          "KeyF",
          "KeyJ",
          "KeyK",
        ],
      ],

      reps: 30,
    }),
    []
  );

  if (!lesson) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2">
        {title}
      </h1>

      <p className="text-gray-400 mb-6">
        {description}
      </p>

      <LessonTrainer config={config} />
    </div>
  );
}
