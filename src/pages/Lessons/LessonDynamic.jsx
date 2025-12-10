import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import lessons from "../../data/lessonData.js";
import LessonTemplate from "./LessonTemplate.jsx";

const LessonDynamic = () => {
  const { id } = useParams();
  const lesson = lessons.find((l) => l.id === Number(id));

  const [LoadedComponent, setLoadedComponent] = useState(null);

  useEffect(() => {
    if (lesson?.component) {
      lesson.component().then((module) => {
        setLoadedComponent(() => module.default);
      });
    }
  }, [lesson]);

  if (!lesson) return <h1 className="p-10 text-white">Lesson not found</h1>;

  if (LoadedComponent) {
    const Component = LoadedComponent;
    return <Component />; 
  }

  return (
    <LessonTemplate title={lesson.title} description={lesson.description}>
      <p className="text-gray-300 mt-10">Trainer coming soon…</p>
    </LessonTemplate>
  );
};

export default LessonDynamic;
