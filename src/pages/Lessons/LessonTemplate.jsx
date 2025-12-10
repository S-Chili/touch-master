import React from "react";
import { Link } from "react-router-dom";

const LessonTemplate = ({ title, description, children }) => {
  return (
    <div className="min-h-screen p-12 text-white bg-black font-mono">

      <Link
        to="/lessons"
        className="inline-flex items-center mb-8 text-cyan-300 hover:text-white transition-all group"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mr-2 group-hover:-translate-x-1 transition-transform"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="text-lg tracking-wide">Back to Lessons</span>
      </Link>

      <h1 className="text-4xl font-bold mb-6 tracking-wide text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">
        {title}
      </h1>

      {description && (
        <p className="text-gray-300 mb-6 text-lg max-w-3xl">
          {description}
        </p>
      )}

      <div className="mt-10 p-6">
        {children}
      </div>

    </div>
  );
};

export default LessonTemplate;
