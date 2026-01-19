const lessons = [
  {
    id: 1,
    titleEn: "Lesson 1 — The Home Row Anchors",
    titleUk: "Урок 1 — Якори домашнього ряду",
    descriptionEn:
      "Master F and J keys. Feel the bumps and set your base position.",
    descriptionUk:
      "Опануй клавіші А та О. Відчуй виступи та встанови базову позицію.",
    component: () => import("../pages/Lessons/lesson1.jsx"),
  },
  {
    id: 2,
    titleEn: "Lesson 2 — Completing the Home Row",
    titleUk: "Урок 2 — Весь середній ряд",
    descriptionEn:
      "Add D, S, A and K, L, ; keys. Your fingers now cover the middle row.",
    descriptionUk:
      "Додай В, І, Ф та Л, Д, Ж. Твої пальці тепер контролюють середній ряд.",
    component: () => import("../pages/Lessons/lesson2.jsx"),
  },
  {
    id: 3,
    titleEn: "Lesson 3 — Reaching Up: E and I",
    titleUk: "Урок 3 — Крок вгору: У та Ш",
    descriptionEn:
      "Middle fingers move up. Learn to reach E and I without moving your wrists.",
    descriptionUk:
      "Середні пальці йдуть вгору. Навчися діставати У та Ш, не рухаючи кистями.",
    component: () => import("../pages/Lessons/lesson3.jsx"),
  },
  {
    id: 4,
    titleEn: "Lesson 4 — Index Finger Stretch: R, U, T, Y",
    titleUk: "Урок 4 — Робота вказівних: К, Г, Е, Н",
    descriptionEn:
      "Index fingers are the most active. Master their reach to the top row.",
    descriptionUk:
      "Вказівні пальці найактивніші. Опануй їхній рух до верхнього ряду.",
    component: () => import("../pages/Lessons/lesson4.jsx"),
  },
  {
    id: 5,
    titleEn: "Lesson 5 — Reaching Down: V, M, C, N,",
    titleUk: "Урок 5 — Крок вниз: М, Ь, С, Т",
    descriptionEn: "Extend index and middle fingers to the bottom row.",
    descriptionUk: "Робота вказівних та середніх пальців з нижнім рядом.",
    component: () => import("../pages/Lessons/lesson5.jsx"),
  },
  {
    id: 6,
    titleEn: "Lesson 6 — Ring and Pinky: W, O, X, ','",
    titleUk: "Урок 6 — Слабкі пальці: Ц, Щ, Ч, Б",
    descriptionEn:
      "Strengthen your ring and pinky fingers on top and bottom rows.",
    descriptionUk:
      "Зміцнюй підмізинні пальці та мізинці на верхньому та нижньому рядах.",
    component: () => import("../pages/Lessons/lesson6.jsx"),
  },
  {
    id: 7,
    titleEn: "Lesson 7 — Corner Keys: Q, P, Z, /",
    titleUk: "Урок 7 — Крайні клавіші: Й, З, Я, .",
    descriptionEn: "Master the most distant alphabet keys with your pinkies.",
    descriptionUk:
      "Опануй найвіддаленіші літери алфавіту за допомогою мізинців.",
    component: () => import("../pages/Lessons/lesson7.jsx"),
  },
  {
    id: 8,
    titleEn: "Lesson 8 — Capitalization (Shift)",
    titleUk: "Урок 8 — Великі літери (Shift)",
    descriptionEn: "Learn the 'opposite hand' rule for the Shift key.",
    descriptionUk: "Вивчи правило 'протилежної руки' для клавіші Shift.",
    component: () => import("../pages/Lessons/lesson8.jsx"),
  },
  {
    id: 9,
    titleEn: "Lesson 9 — Numbers & Basic Symbols",
    titleUk: "Урок 9 — Цифри та знаки",
    descriptionEn: "Reaching the top-most row. Numbers and simple punctuation.",
    descriptionUk: "Робота з найвищим рядом. Цифри та проста пунктуація.",
    component: () => import("../pages/Lessons/lesson9.jsx"),
  },
  {
    id: 10,
    titleEn: "Lesson 10 — Full Text Flow",
    titleUk: "Урок 10 — Повний текстовий потік",
    descriptionEn:
      "Combine everything: letters, capitals, and punctuation in real sentences.",
    descriptionUk:
      "Поєднай усе: літери, великі букви та знаки в реальних реченнях.",
    component: () => import("../pages/Lessons/lesson10.jsx"),
  },
];

export default lessons;
