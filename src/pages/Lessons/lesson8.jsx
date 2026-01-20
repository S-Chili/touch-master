import React, { useMemo } from "react";
import LessonTrainer from "./LessonTrainer";
import { useSettings } from "../../context/useSettings";
import lessons from "../../data/lessonData";

export default function Lesson8() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const lesson = useMemo(
    () => lessons.find((l) => l.id === 8),
    []
  );

  const title = isUK ? lesson.titleUk : lesson.titleEn;
  const description = isUK ? lesson.descriptionUk : lesson.descriptionEn;

  const config = useMemo(
    () => ({
      id: 8,

      stages: [
        [
          { code: "KeyF", shift: "opposite" },
          { code: "KeyJ", shift: "opposite" },
        ],
        [
          { code: "KeyD", shift: "opposite" },
          { code: "KeyK", shift: "opposite" },
          { code: "KeyS", shift: "opposite" },
          { code: "KeyL", shift: "opposite" },
        ],
        [
          { code: "KeyA", shift: "opposite" },
          { code: "Semicolon", shift: "opposite" },
          { code: "KeyF", shift: "opposite" },
          { code: "KeyJ", shift: "opposite" },
        ],
      ],

      reps: 18,
    }),
    []
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{description}</p>

      <LessonTrainer config={config} />
    </div>
  );
}
