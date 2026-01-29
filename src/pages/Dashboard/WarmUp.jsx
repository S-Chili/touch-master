import React, { useMemo } from "react";
import LessonTrainer from "../Lessons/LessonTrainer";
import { useSettings } from "../../context/useSettings";
import lessons from "../../data/lessonData";

export default function WarmUp() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const WARMUP_ID = 'warmup';

  const lesson = useMemo(() => {
    return (Array.isArray(lessons) ? lessons : []).find(
      (l) => Number(l.id) === WARMUP_ID
    );
  }, []);

  const title = lesson
    ? (isUK ? lesson.titleUk : lesson.titleEn)
    : (isUK ? "Розігрів" : "Warm-up");

  const description = lesson
    ? (isUK ? lesson.descriptionUk : lesson.descriptionEn)
    : (isUK ? "Короткий тренувальний режим." : "Quick training mode.");

  const config = useMemo(
    () => ({
      id: `warmup_${WARMUP_ID}`,
      stages: [
        [
          "KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL",
          "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP",
          "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM",
        ],
        [
          "KeyA","KeyS","KeyD","KeyF","KeyJ","KeyK","KeyL",
          "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP",
          "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM",
        ],
        [
          "KeyA","KeyS","KeyD","KeyF","KeyJ","KeyK","KeyL",
          "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP",
          "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM",
        ],
      ],
      reps: 25,
    }),
    []
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-white mb-2">{title}</h1>
      <p className="text-gray-400 mb-6">{description}</p>

      <LessonTrainer config={config} />
    </div>
  );
}
