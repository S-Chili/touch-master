import React, { useMemo } from "react";
import { useSettings } from "../../context/useSettings";

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";
const NEO_PURPLE = "#8a2be2";
const NEO_DARK = "#0a0c11";

const GlowCard = ({ children, color = NEO_BLUE, className = "" }) => (
  <div
    className={`rounded-2xl p-6 bg-black/45 border backdrop-blur-sm transition-all duration-300 ${className}`}
    style={{
      borderColor: `${color}55`,
      boxShadow: `0 0 26px ${color}14`,
    }}
  >
    {children}
  </div>
);

const Chip = ({ children, tone = "cyan" }) => {
  const map = {
    cyan: { b: "border-cyan-400/30", t: "text-cyan-200", bg: "bg-cyan-500/10" },
    pink: { b: "border-pink-400/30", t: "text-pink-200", bg: "bg-pink-500/10" },
    purple: { b: "border-purple-400/30", t: "text-purple-200", bg: "bg-purple-500/10" },
    gray: { b: "border-white/10", t: "text-gray-200", bg: "bg-white/5" },
  }[tone];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs tracking-widest uppercase ${map.b} ${map.t} ${map.bg}`}
    >
      {children}
    </span>
  );
};

const IconSpark = ({ color = NEO_PINK }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="M12 2l1.5 6.2L20 10l-6.5 1.8L12 18l-1.5-6.2L4 10l6.5-1.8L12 2z" />
  </svg>
);

const IconTerminal = ({ color = NEO_BLUE }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6">
    <path d="M4 6h16v12H4z" />
    <path d="M7 10l2 2-2 2" />
    <path d="M11 14h6" />
  </svg>
);

const ContactRow = ({ isUK }) => (
  <div className="mt-5 space-y-2 text-sm">
    <a
      href="https://github.com/S-Chili"
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 text-gray-300 hover:text-white transition"
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: NEO_BLUE }} />
      <span className="tracking-wider">github.com/S-Chili</span>
    </a>

    <a
      href="mailto:SChili@outlook.com"
      className="flex items-center gap-2 text-gray-300 hover:text-white transition"
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: NEO_PINK }} />
      <span className="tracking-wider">SChili@outlook.com</span>
    </a>

    <div className="text-[10px] text-gray-500 tracking-widest uppercase">
      {isUK ? "Звʼязок: GitHub / Email" : "Reach out: GitHub / Email"}
    </div>
  </div>
);

export default function About() {
  const { language } = useSettings();
  const isUK = language === "uk";

  const content = useMemo(() => {
    if (isUK) {
      return {
        title: "ПРО НАС",
        subtitle: "Мінімалізм. Неон. Дисципліна друку.",
        introTitle: "Привіт, я Анастасія",
        introText:
          "Я створила цей веб-застосунок як персональну лабораторію для прокачки сліпого друку та фокусу. Тут немає зайвого — лише практика, ритм і прогрес.",
        whyTitle: "Навіщо цей застосунок",
        whyBullets: [
          "щоб тренування були короткі, але регулярні",
          "щоб бачити прогрес (WPM, точність, серія днів)",
          "щоб уроки відкривались поступово і мотивували йти далі",
          "щоб режим “Free Typing” знімав напругу та давав свободу",
        ],
        noteTitle: "Приватність",
        noteText:
          "Твій прогрес зберігається локально в браузері (LocalStorage). Нічого не відправляється на сервер.",
        featuresTitle: "Ключові фічі",
        features: [
          {
            t: "Уроки з прогресом",
            d: "Поступове відкриття уроків + останній/наступний урок на сторінці уроків.",
          },
          { t: "Розігрів", d: "Швидка сесія перед тренуванням — для входу в ритм." },
          { t: "Free Typing", d: "Друкуй що хочеш, як на аркуші. Пауза зупиняє таймер і WPM." },
          { t: "Статистика", d: "Сесії зберігаються локально, графік адаптується до кількості днів/записів." },
        ],
        stackTitle: "Технічний стек",
        stack: ["React", "Vite", "Tailwind", "LocalStorage", "React Router"],
        contactTitle: "Контакти",
        contactText: "Хочеш фічу або бачиш баг — напиши мені, я додам у roadmap.",
        footer: "TouchMaster — cyber-minimal typing lab.",
        labels: {
          creator: "Автор",
          cyberProfile: "Cyber profile",
          consistency: "Стабільність > мотивація",
        },
      };
    }

    return {
      title: "ABOUT",
      subtitle: "Minimal. Neon. Typing discipline.",
      introTitle: "Hi, I’m Anastasiia",
      introText:
        "I built this web app as a personal lab to improve touch typing and focus. No clutter — just practice, rhythm, and progress.",
      whyTitle: "Why this app exists",
      whyBullets: [
        "short but consistent practice sessions",
        "visible progress (WPM, accuracy, streak)",
        "progressive lesson unlock to keep you moving",
        "Free Typing mode for relaxed, creative practice",
      ],
      noteTitle: "Privacy",
      noteText: "Your progress is stored locally in your browser (LocalStorage). Nothing is sent to a server.",
      featuresTitle: "Core features",
      features: [
        { t: "Lessons with progress", d: "Progressive unlock + current/next lesson shown on Lessons page." },
        { t: "Warm-Up", d: "Fast session before training to get into flow." },
        { t: "Free Typing", d: "Type anything on an A4-like sheet. Pause freezes time & WPM." },
        { t: "Stats", d: "Local sessions, adaptive chart behavior based on available data." },
      ],
      stackTitle: "Tech stack",
      stack: ["React", "Vite", "Tailwind", "LocalStorage", "React Router"],
      contactTitle: "Contact",
      contactText: "Want a feature or spotted a bug? Message me — I’ll add it to the roadmap.",
      footer: "TouchMaster — cyber-minimal typing lab.",
      labels: {
        creator: "Creator",
        cyberProfile: "Cyber profile",
        consistency: "Consistency > motivation",
      },
    };
  }, [isUK]);

  return (
    <div className="relative w-full min-h-screen p-8 font-mono text-cyan-200" style={{ backgroundColor: NEO_DARK }}>
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,0,200,0.04)_1px,transparent_1px)] bg-size-[90px_90px] pointer-events-none" />

      {/* top glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${NEO_PINK} 0%, transparent 60%)` }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Chip tone="pink">Cyber Minimal</Chip>
            <Chip tone="cyan">Typing Lab</Chip>
            <Chip tone="purple">Local Progress</Chip>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-white">{content.title}</h1>
          <p className="text-gray-400 max-w-2xl">{content.subtitle}</p>

          <div className="mt-2 h-px w-full bg-linear-to-r from-cyan-500/20 via-pink-500/20 to-transparent" />
        </div>

        {/* HERO + WHY (single grid to remove empty gap) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          {/* Left / Row 1: Intro */}
          <div className="lg:col-span-2">
            <GlowCard color={NEO_BLUE} className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <IconTerminal />
                <h2 className="text-xl font-bold text-white tracking-wider">{content.introTitle}</h2>
              </div>

              <p className="text-gray-300 leading-relaxed">{content.introText}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Chip tone="cyan">WPM</Chip>
                <Chip tone="pink">{isUK ? "Точність" : "Accuracy"}</Chip>
                <Chip tone="purple">{isUK ? "Серія" : "Streak"}</Chip>
              </div>

              <div className="mt-5 text-xs text-gray-500 tracking-widest uppercase">{content.labels.consistency}</div>
            </GlowCard>
          </div>

          {/* Right / Row 1-2: Photo (spans 2 rows) */}
          <div className="lg:row-span-2">
            <GlowCard color={NEO_PINK} className="h-full">
              <div className="flex flex-col h-full">
                <div
                  className="relative rounded-xl overflow-hidden border bg-black/30"
                  style={{ borderColor: `${NEO_PINK}44` }}
                >
                  {/* Put your image in /public/anastasiia-cyber.png */}
                  <img
                    src="/anastasiia-cyber.png"
                    alt="Anastasiia — cyber portrait"
                    className="w-full h-[260px] object-cover"
                  />

                  {/* Neon overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-35 bg-[linear-gradient(90deg,rgba(0,255,255,0.10)_1px,transparent_1px),linear-gradient(rgba(255,0,200,0.10)_1px,transparent_1px)] bg-size-[60px_60px]" />
                  <div
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[320px] h-[120px] blur-3xl opacity-35 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${NEO_BLUE} 0%, transparent 70%)` }}
                  />
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-400 tracking-widest uppercase">{content.labels.creator}</div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-white font-bold tracking-wider text-lg">Anastasiia</div>
                    <div className="text-[10px] text-gray-500 tracking-widest uppercase">{content.labels.cyberProfile}</div>
                  </div>

                  <ContactRow isUK={isUK} />
                </div>

                <div className="mt-auto pt-4 text-[10px] text-gray-500 tracking-widest uppercase">
                  TouchMaster Creator
                </div>
              </div>
            </GlowCard>
          </div>

          {/* Left / Row 2: Why + Privacy (two cards inside) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlowCard color={NEO_PURPLE} className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <IconSpark />
                <h3 className="text-xl font-bold text-white tracking-wider">{content.whyTitle}</h3>
              </div>

              <ul className="mt-3 space-y-2 text-gray-300">
                {content.whyBullets.map((x, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: i % 2 ? NEO_PINK : NEO_BLUE }}
                    />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>

            <GlowCard color={NEO_BLUE} className="h-full">
              <h3 className="text-xl font-bold text-white tracking-wider mb-3">{content.noteTitle}</h3>
              <p className="text-gray-300 leading-relaxed">{content.noteText}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Chip tone="gray">LocalStorage</Chip>
                <Chip tone="cyan">{isUK ? "Без сервера" : "No server"}</Chip>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Features */}
        <GlowCard color={NEO_PINK}>
          <h3 className="text-2xl font-extrabold text-white tracking-wider mb-4">{content.featuresTitle}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.features.map((f, i) => (
              <div
                key={i}
                className="rounded-xl p-4 border bg-black/35 transition-all duration-300 hover:bg-black/45"
                style={{
                  borderColor: `${i % 2 ? NEO_PINK : NEO_BLUE}44`,
                  boxShadow: `0 0 18px ${(i % 2 ? NEO_PINK : NEO_BLUE)}10`,
                }}
              >
                <div className="text-sm font-bold tracking-widest uppercase text-white mb-1">{f.t}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Stack + Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <GlowCard color={NEO_BLUE}>
            <h3 className="text-xl font-bold text-white tracking-wider mb-3">{content.stackTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {content.stack.map((s) => (
                <Chip key={s} tone="cyan">
                  {s}
                </Chip>
              ))}
            </div>

            <div className="mt-6 text-xs text-gray-500 tracking-widest uppercase">
              {isUK ? "Швидко. Локально. Прозоро." : "Fast. Local. Transparent."}
            </div>
          </GlowCard>

          <div className="lg:col-span-2">
            <GlowCard color={NEO_PURPLE}>
              <h3 className="text-xl font-bold text-white tracking-wider mb-2">{content.contactTitle}</h3>
              <p className="text-gray-300 leading-relaxed">{content.contactText}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Chip tone="pink">Roadmap</Chip>
                <Chip tone="purple">Bugfix</Chip>
                <Chip tone="cyan">UX</Chip>
              </div>

              <div className="mt-5">
                <ContactRow isUK={isUK} />
              </div>

              <div className="mt-6 h-px w-full bg-linear-to-r from-purple-500/20 via-cyan-500/20 to-transparent" />
              <div className="mt-4 text-xs text-gray-500">{content.footer}</div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
