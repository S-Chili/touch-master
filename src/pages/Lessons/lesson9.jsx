import React, { useMemo } from "react";
import LessonTrainer from "./LessonTrainer";
import { useSettings } from "../../context/useSettings";
import lessons from "../../data/lessonData";

export default function Lesson9() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const lesson = useMemo(() => lessons.find((l) => l.id === 9), []);

  const title = isUK ? lesson.titleUk : lesson.titleEn;
  const description = isUK ? lesson.descriptionUk : lesson.descriptionEn;

  const config = useMemo(
    () => ({
      id: 9,
      stages: [
        ["Digit1", "Digit2", "Digit3", "Digit4"],
        ["Digit5", "Digit6", "Digit7", "Digit8"],
        ["Digit9", "Digit0", "Minus", "Equal"],
        ["Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0","Minus","Equal"],
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
