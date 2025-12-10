import React from "react";

// --- ДАНІ КЛАВІАТУРИ (Спрощена версія для прикладу) ---
// Ця структура тепер містить мітки (labels)
const KEYBOARD_LAYOUT = [
    // РЯДОК 1 (QWERTY)
    [
        { w: 'w-[75px]', label: 'tab' },
        { w: 'w-[58px]', label: 'Q' },
        { w: 'w-[58px]', label: 'W' },
        { w: 'w-[58px]', label: 'E' },
        { w: 'w-[58px]', label: 'R' },
        { w: 'w-[58px]', label: 'T' },
        { w: 'w-[58px]', label: 'Y' },
        { w: 'w-[58px]', label: 'U' },
        { w: 'w-[58px]', label: 'I' },
        { w: 'w-[58px]', label: 'O' },
        { w: 'w-[58px]', label: 'P' },
        { w: 'w-[58px]', label: '{' },
        { w: 'w-[58px]', label: '}' },
        { w: 'w-[90px]', label: 'enter' },
    ],
    // РЯДОК 2 (ASDF)
    [
        { w: 'w-[95px]', label: 'caps' },
        { w: 'w-[58px]', label: 'A' },
        { w: 'w-[58px]', label: 'S' },
        { w: 'w-[58px]', label: 'D' },
        { w: 'w-[58px]', label: 'F' },
        { w: 'w-[58px]', label: 'G' },
        { w: 'w-[58px]', label: 'H' },
        { w: 'w-[58px]', label: 'J' },
        { w: 'w-[58px]', label: 'K' },
        { w: 'w-[58px]', label: 'L' },
        { w: 'w-[58px]', label: ':' },
        { w: 'w-[58px]', label: '"' },
        { w: 'w-[58px]', label: '|' },
        { w: 'w-[110px]', label: 'enter' },
    ],
    // РЯДОК 3 (ZXCV)
    [
        { w: 'w-[125px]', label: 'shift' },
        { w: 'w-[58px]', label: '~' },
        { w: 'w-[58px]', label: 'Z' },
        { w: 'w-[58px]', label: 'X' },
        { w: 'w-[58px]', label: 'C' },
        { w: 'w-[58px]', label: 'V' },
        { w: 'w-[58px]', label: 'B' },
        { w: 'w-[58px]', label: 'N' },
        { w: 'w-[58px]', label: 'M' },
        { w: 'w-[58px]', label: '<' },
        { w: 'w-[58px]', label: '>' },
        { w: 'w-[58px]', label: '/' },
        { w: 'w-[145px]', label: 'shift' },
    ],
];

// Оновлений компонент тепер приймає пропси
export default function NeonKeyboard({ showLabels = false }) {
  const keyBaseStyle =
    "border border-neoBlue/70 bg-neoDark/40 rounded-md shadow-[0_0_15px_#00eaff80] hover:shadow-[0_0_25px_#00eaff] transition-all duration-200";

  const H_STD = "h-[50px]";
  const GAP = "gap-3";

  const keyRows = KEYBOARD_LAYOUT;

  // Bottom row sizes
  const W_STD = "w-[58px]";
  const W_FN = "w-[58px]";
  const W_CONTROL = "w-[70px]";
  const W_OPTION = "w-[65px]";
  const W_COMMAND = "w-[80px]";
  const W_SPACE = "w-[280px]";

  return (
    <div
      className="
        w-full max-w-[1100px] mx-auto p-8 rounded-2xl
        border border-neoBlue/40
        shadow-[0_0_40px_#00eaff55]
        bg-neoDark/40 select-none
      "
    >
      <div className={`flex flex-col ${GAP}`}>

        {/* ROWS 1–3 */}
        {keyRows.map((row, i) => (
          <div key={i} className={`flex justify-center ${GAP}`}>
            {row.map((keyData, j) => (
              <div
                key={j}
                className={`${keyBaseStyle} ${keyData.w} ${H_STD} flex items-center justify-center text-lg font-bold`}
              >
                {showLabels ? keyData.label.toUpperCase() : null}
              </div>
            ))}
          </div>
        ))}

        {/* BOTTOM ROW */}
        <div className={`flex justify-center ${GAP} mt-3`}>

          {/* LEFT BLOCK */}
          <div className={`flex ${GAP}`}>
            <div className={`${keyBaseStyle} ${W_FN} ${H_STD} flex items-center justify-center text-xs`}>
              {showLabels ? "FN" : null}
            </div>

            <div className={`${keyBaseStyle} ${W_CONTROL} ${H_STD} flex items-center justify-center text-xs`}>
              {showLabels ? "CONTROL" : null}
            </div>

            <div className={`${keyBaseStyle} ${W_OPTION} ${H_STD} flex items-center justify-center text-xs`}>
              {showLabels ? "OPTION" : null}
            </div>

            <div className={`${keyBaseStyle} ${W_COMMAND} ${H_STD} flex items-center justify-center text-xs`}>
              {showLabels ? "COMMAND" : null}
            </div>
          </div>

          {/* SPACEBAR */}
          <div className={`${keyBaseStyle} ${W_SPACE} ${H_STD}`} />

          {/* RIGHT BLOCK */}
          <div className={`flex ${GAP}`}>
            <div className={`${keyBaseStyle} ${W_COMMAND} ${H_STD} flex items-center justify-center text-xs`}>
              {showLabels ? "COMMAND" : null}
            </div>

            <div className={`${keyBaseStyle} ${W_OPTION} ${H_STD} flex items-center justify-center text-xs`}>
              {showLabels ? "OPTION" : null}
            </div>
          </div>

          {/* ARROWS */}
          <div className={`flex ${GAP}`}>
            {/* LEFT */}
            <div className={`${keyBaseStyle} ${W_STD} ${H_STD}`} />

            {/* UP/DOWN STACK */}
            <div className="flex flex-col gap-1">
              <div className={`${keyBaseStyle} ${W_STD} h-[24px]`} />
              <div className={`${keyBaseStyle} ${W_STD} h-[24px]`} />
            </div>

            {/* RIGHT */}
            <div className={`${keyBaseStyle} ${W_STD} ${H_STD}`} />
          </div>

        </div>
      </div>
    </div>
  );
}
