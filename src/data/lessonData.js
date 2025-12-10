const lessons = [
  {
    id: 1,
    title: "Lesson 1 — Base Hand Position",
    description:
      "Learn the fundamental position for touch typing hands over the keyboard.",
    component: () => import("../pages/Lessons/lesson1.jsx"),
  },
  {
    id: 2,
    title: "Lesson 2 — F and J Keys",
    description: "Introduce the key anchors for your index fingers.",
    component: () => import("../pages/Lessons/lesson2.jsx"),
  },
  {
    id: 3,
    title: "Lesson 3 — The Home Row",
    description:
      "Master the center row (ASDF JKL;) which serves as the base of operations.",
    component: () => import("../pages/Lessons/lesson3.jsx"),
  },
  {
    id: 4,
    title: "Lesson 4 — Top Row (T & Y)",
    description:
      "Expanding reach to the top row, focusing on T, Y, and surrounding keys.",
    component: () => import("../pages/Lessons/lesson4.jsx"),
  },
  {
    id: 5,
    title: "Lesson 5 — Bottom Row",
    description:
      "Practicing the lowest row (Z, X, C, V, M, N) and thumb movement.",
    component: () => import("../pages/Lessons/lesson5.jsx"),
  },
  {
    id: 6,
    title: "Lesson 6 — Punctuation Basics",
    description:
      "Typing common symbols like comma, period, question mark, and apostrophe.",
    component: () => import("../pages/Lessons/lesson6.jsx"),
  },
  {
    id: 7,
    title: "Lesson 7 — Capitalization & Shift Keys",
    description:
      "Proper use of the Shift keys for capitalization and special characters.",
    component: () => import("../pages/Lessons/lesson7.jsx"),
  },
  {
    id: 8,
    title: "Lesson 8 — Number Row (Digits)",
    description: "Focus on typing the numbers 1 through 0 without looking.",
    component: () => import("../pages/Lessons/lesson8.jsx"),
  },
  {
    id: 9,
    title: "Lesson 9 — Special Symbols",
    description:
      "Typing less common symbols using the Shift key (e.g., %, $, &, @).",
    component: () => import("../pages/Lessons/lesson9.jsx"),
  },
  {
    id: 10,
    title: "Lesson 10 — Speed and Endurance Test",
    description:
      "Final comprehensive test combining all rows and symbols for speed and accuracy.",
    component: () => import("../pages/Lessons/lesson10.jsx"),
  },
];

export default lessons;
