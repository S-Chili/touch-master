import React, { useMemo } from "react";
import LessonTrainer from "./LessonTrainer";
import { useSettings } from "../../context/useSettings";
import lessons from "../../data/lessonData";

export default function Lesson10() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const lesson = useMemo(() => lessons.find((l) => l.id === 10), []);

  const title = isUK ? lesson.titleUk : lesson.titleEn;
  const description = isUK ? lesson.descriptionUk : lesson.descriptionEn;

  const config = useMemo(
    () => ({
      id: 10,
      stages: [
        [
          "KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote",
          "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight",
          "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash"
        ],
        [
          "KeyA","KeyS","KeyD","KeyF","KeyJ","KeyK","KeyL","Semicolon","Quote",
          "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight",
          "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash",

          "Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0",
          "Minus","Equal"
        ],
        [
          "KeyA","KeyS","KeyD","KeyF","KeyJ","KeyK","KeyL",
          "KeyQ","KeyW","KeyE","KeyR","KeyT",
          "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM",

          { code: "KeyA", shift: "any" },
          { code: "KeyS", shift: "any" },
          { code: "KeyD", shift: "any" },
          { code: "KeyF", shift: "any" },
          { code: "KeyJ", shift: "any" },
          { code: "KeyK", shift: "any" },
          { code: "KeyL", shift: "any" }
        ],
        [
          "Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0",

          { code: "Digit1", shift: "any" }, 
          { code: "Digit2", shift: "any" }, 
          { code: "Digit3", shift: "any" },
          { code: "Digit4", shift: "any" },
          { code: "Digit5", shift: "any" }
        ],
        [
          "KeyA","KeyS","KeyD","KeyF","KeyJ","KeyK","KeyL","Semicolon",
          "KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP",
          "KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM",
          "Comma","Period","Slash",
          "Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Digit0",
          { code: "KeyQ", shift: "any" },
          { code: "KeyW", shift: "any" },
          { code: "KeyE", shift: "any" },
          { code: "KeyR", shift: "any" },
          { code: "KeyT", shift: "any" },

          { code: "KeyA", shift: "any" },
          { code: "KeyS", shift: "any" },
          { code: "KeyD", shift: "any" },

          { code: "Digit1", shift: "any" },
          { code: "Digit2", shift: "any" },
          { code: "Digit3", shift: "any" }
        ]
      ],
      reps: 25,
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
