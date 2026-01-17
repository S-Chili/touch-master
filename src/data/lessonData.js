const lessons = [
  {
    id: 1,
    titleEn: "Lesson 1 — Home Row Mastery",
    titleUk: "Урок 1 — Домашній ряд",
    descriptionEn:
      "Learn the fundamental position for touch typing hands over the keyboard.",
    descriptionUk:
      "Вивчи базову позицію пальців для сліпого набору на клавіатурі.",
    component: () => import("../pages/Lessons/lesson1.jsx"),
  },
  {
    id: 2,
    titleEn: "Lesson 2 — E and I Keys",
    titleUk: "Урок 2 — Клавіші У та Ш",
    descriptionEn:
      "Introduce the most common vowels in the top row using your middle fingers.",
    descriptionUk: "Освой літери верхнього ряду середніми пальцями.",
    component: () => import("../pages/Lessons/lesson2.jsx"),
  },
  {
    id: 3,
    titleEn: "Lesson 3 — R, U, and O Keys",
    titleUk: "Урок 3 — Клавіші К, Г та Щ",
    descriptionEn:
      "Expanding your reach on the top row to strengthen index and ring fingers.",
    descriptionUk:
      "Розширюй зону досяжності верхнього ряду для вказівних та підмізинних пальців.",
    component: () => import("../pages/Lessons/lesson3.jsx"),
  },
  {
    id: 4,
    titleEn: "Lesson 4 — W and P Keys",
    titleUk: "Урок 4 — Клавіші Ц та З",
    descriptionEn:
      "Focus on the outer reaches of the top row with your ring and pinky fingers.",
    descriptionUk:
      "Зосередься на крайніх клавішах верхнього ряду підмізинним пальцем та мізинцем.",
    component: () => import("../pages/Lessons/lesson4.jsx"),
  },
  {
    id: 5,
    titleEn: "Lesson 5 — Bottom Row: V, B, N, M",
    titleUk: "Урок 5 — Нижній ряд: М, И, Т, Ь",
    descriptionEn:
      "Transition to the bottom row using index fingers for central keys.",
    descriptionUk:
      "Переходь до нижнього ряду, використовуючи вказівні пальці для центральних клавіш.",
    component: () => import("../pages/Lessons/lesson5.jsx"),
  },
  {
    id: 6,
    titleEn: "Lesson 6 — The Full Bottom Row",
    titleUk: "Урок 6 — Повний нижній ряд",
    descriptionEn:
      "Master Z, X, C and punctuation keys to complete the alphabet.",
    descriptionUk:
      "Опануй Я, Ч, С та клавіші пунктуації, щоб завершити вивчення алфавіту.",
    component: () => import("../pages/Lessons/lesson6.jsx"),
  },
  {
    id: 7,
    titleEn: "Lesson 7 — Capitalization & Shift Keys",
    titleUk: "Урок 7 — Велика літера та Shift",
    descriptionEn:
      "Learn to use opposite Shift keys for smooth capitalization.",
    descriptionUk:
      "Навчися використовувати протилежні клавіші Shift для плавного написання великих літер.",
    component: () => import("../pages/Lessons/lesson7.jsx"),
  },
  {
    id: 8,
    titleEn: "Lesson 8 — Number Row Basics",
    titleUk: "Урок 8 — Основи цифрового ряду",
    descriptionEn:
      "Start typing digits 1 through 0 without looking away from the screen.",
    descriptionUk:
      "Почни набирати цифри від 1 до 0, не відводячи погляду від екрана.",
    component: () => import("../pages/Lessons/lesson8.jsx"),
  },
  {
    id: 9,
    titleEn: "Lesson 9 — Special Symbols",
    titleUk: "Урок 9 — Спеціальні символи",
    descriptionEn:
      "Master complex symbols like %, $, &, and @ using Shift and numbers.",
    descriptionUk:
      "Опануй складні символи, такі як %, $, &, та @, використовуючи Shift та цифри.",
    component: () => import("../pages/Lessons/lesson9.jsx"),
  },
  {
    id: 10,
    titleEn: "Lesson 10 — Ultimate Speed Test",
    titleUk: "Урок 10 — Тест на швидкість",
    descriptionEn:
      "A comprehensive final challenge to test your speed and accuracy.",
    descriptionUk:
      "Комплексний фінальний іспит для перевірки твоєї швидкості та точності.",
    component: () => import("../pages/Lessons/lesson10.jsx"),
  },
];

export default lessons;
