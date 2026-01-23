import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../context/useSettings";

const NEO_BLUE = "#00eaff";
const NEO_PINK = "#ff00e6";
const NEO_PURPLE = "#8a2be2";
const NEO_DARK = "#0a0c11";

const IconLightning = ({ color }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`drop-shadow-[0_0_5px_${color}cc] transition-colors duration-300`}
  >
    <path d="M13 2L3 14h7l-1 8 11-12h-7l1-8z" />
  </svg>
);

const IconShield = ({ color }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`drop-shadow-[0_0_5px_${color}cc] transition-colors duration-300`}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconMaze = ({ color }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`drop-shadow-[0_0_5px_${color}cc] transition-colors duration-300`}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <path d="M12 7h5" />
    <path d="M7 12v5" />
  </svg>
);

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const GameCard = ({
  title,
  description,
  icon,
  color,
  isNew = false,
  neoPinkColor,
  path,
  ctaText,
  newText,
}) => {
  const IconComponent = icon;
  const styleVariables = {
    "--card-color": color,
    "--shadow-base": hexToRgba(color, 0.4),
    "--shadow-hover": hexToRgba(color, 0.8),
    "--bg-hover": hexToRgba(color, 0.15),
  };

  return (
    <Link
      to={path}
      className={`
        group p-6 rounded-xl transition-all duration-300
        flex flex-col items-center text-center 
        bg-black/40 backdrop-blur-sm cursor-pointer
        border-2 border-(--card-color)
        shadow-[0_0_15px_var(--shadow-base)]
        hover:shadow-[0_0_30px_var(--shadow-hover)]
        hover:bg-(--bg-hover)
      `}
      style={styleVariables}
    >
      <div className="relative mb-4">
        <IconComponent color={color} />
        {isNew && (
          <span
            className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                       text-black text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: neoPinkColor,
              boxShadow: `0 0 8px ${neoPinkColor}99`,
            }}
          >
            {newText}
          </span>
        )}
      </div>

      <h3 className="text-2xl font-bold tracking-wide mb-2 text-(--card-color)">
        {title}
      </h3>

      <p className="text-sm text-gray-300 mb-5">{description}</p>

      <div
        className={`
          mt-auto px-6 py-2 text-md font-bold rounded-lg
          border border-(--card-color) text-(--card-color)
          transition-all duration-300
          group-hover:bg-(--card-color) group-hover:text-black 
        `}
        style={{ boxShadow: `0 0 8px ${hexToRgba(color, 0.4)}` }}
      >
        {ctaText}
      </div>
    </Link>
  );
};

const Games = () => {
  const { language } = useSettings();
  const isUk = language === "uk";

  const ui = useMemo(() => {
    if (isUk) {
      return {
        pageTitle: "ІГРОВИЙ АРКАДНИЙ РЕЖИМ",
        pageSubtitle:
          "Прокачай навички в різних режимах. Обери гру, щоб покращити швидкість, точність або памʼять.",
        playNow: "Грати",
        new: "НОВЕ",
        games: [
          {
            title: "ГОНКА З ЧАСОМ",
            description:
              "Перевір свій максимум швидкості. Друкуй без зупинки, доки не закінчиться час.",
          },
          {
            title: "ЩИТ ТОЧНОСТІ",
            description:
              "Фокус на нуль помилок. Кожна помилка зменшує рахунок або додає штраф.",
          },
          {
            title: "ЛАБІРИНТ ПАМʼЯТІ",
            description:
              "Слова зʼявляються на мить і зникають — введи з памʼяті. Прокачай інтуїцію та памʼять.",
          },
        ],
      };
    }

    return {
      pageTitle: "TYPING ARCADE",
      pageSubtitle:
        "Challenge your skills in different modes. Choose a game to improve speed, accuracy, or memory.",
      playNow: "Play Now",
      new: "NEW",
      games: [
        {
          title: "RACE AGAINST TIME",
          description:
            "Test your raw WPM limit. Type continuously until the timer runs out.",
        },
        {
          title: "ACCURACY SHIELD",
          description:
            "Focus on zero mistakes. Each error reduces your score or adds penalties.",
        },
        {
          title: "MEMORY MAZE",
          description:
            "Words appear briefly then vanish — type from memory. Improve intuition and recall.",
        },
      ],
    };
  }, [isUk]);

  const gamesData = useMemo(
    () => [
      {
        ...ui.games[0],
        icon: IconLightning,
        color: NEO_BLUE,
        isNew: false,
        path: "/games/race",
      },
      {
        ...ui.games[1],
        icon: IconShield,
        color: NEO_PINK,
        isNew: true,
        path: "/games/accuracy",
      },
      {
        ...ui.games[2],
        icon: IconMaze,
        color: NEO_PURPLE,
        isNew: false,
        path: "/games/memory",
      },
    ],
    [ui.games]
  );

  return (
    <div className="relative w-full min-h-screen p-8 font-mono" style={{ background: NEO_DARK }}>
      <h1 className="text-4xl font-extrabold text-white mb-10 tracking-wider text-center uppercase">
        {ui.pageTitle}
      </h1>

      <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
        {ui.pageSubtitle}
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {gamesData.map((game, index) => (
          <GameCard
            key={index}
            {...game}
            neoPinkColor={NEO_PINK}
            ctaText={ui.playNow}
            newText={ui.new}
          />
        ))}
      </div>
    </div>
  );
};

export default Games;
