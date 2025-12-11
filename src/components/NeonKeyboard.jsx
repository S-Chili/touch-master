import React from "react";

const KEYBOARD_LAYOUT = [
  // Row 1
  [
    { w: "w-[75px]", label: "tab" },
    { w: "w-[58px]", label: "Q" },
    { w: "w-[58px]", label: "W" },
    { w: "w-[58px]", label: "E" },
    { w: "w-[58px]", label: "R" },
    { w: "w-[58px]", label: "T" },
    { w: "w-[58px]", label: "Y" },
    { w: "w-[58px]", label: "U" },
    { w: "w-[58px]", label: "I" },
    { w: "w-[58px]", label: "O" },
    { w: "w-[58px]", label: "P" },
    { w: "w-[58px]", label: "{" },
    { w: "w-[58px]", label: "}" },
    { w: "w-[90px]", label: "enter" },
  ],
  // Row 2
  [
    { w: "w-[95px]", label: "caps" },
    { w: "w-[58px]", label: "A" },
    { w: "w-[58px]", label: "S" },
    { w: "w-[58px]", label: "D" },
    { w: "w-[58px]", label: "F" },
    { w: "w-[58px]", label: "G" },
    { w: "w-[58px]", label: "H" },
    { w: "w-[58px]", label: "J" },
    { w: "w-[58px]", label: "K" },
    { w: "w-[58px]", label: "L" },
    { w: "w-[58px]", label: ":" },
    { w: "w-[58px]", label: '"' },
    { w: "w-[58px]", label: "|" },
    { w: "w-[110px]", label: "enter" },
  ],
  // Row 3
  [
    { w: "w-[125px]", label: "shift" },
    { w: "w-[58px]", label: "~" },
    { w: "w-[58px]", label: "Z" },
    { w: "w-[58px]", label: "X" },
    { w: "w-[58px]", label: "C" },
    { w: "w-[58px]", label: "V" },
    { w: "w-[58px]", label: "B" },
    { w: "w-[58px]", label: "N" },
    { w: "w-[58px]", label: "M" },
    { w: "w-[58px]", label: "<" },
    { w: "w-[58px]", label: ">" },
    { w: "w-[58px]", label: "/" },
    { w: "w-[145px]", label: "shift" },
  ],
];

// Bottom row widths
const W_STD = "w-[58px]";
const W_FN = "w-[58px]";
const W_CONTROL = "w-[70px]";
const W_OPTION = "w-[65px]";
const W_COMMAND = "w-[80px]";
const W_SPACE = "w-[280px]";

export default function NeonKeyboard({ showLabels = false, highlightKeys = [], allowedKeys = [], errorFlash = false }) {

  const isAllowed = (label) => {
    return allowedKeys.map((k) => k.toLowerCase()).includes(label.toLowerCase());
  };

  const isHighlighted = (label) => {
    return highlightKeys.map((k) => k.toLowerCase()).includes(label.toLowerCase());
  };

  const keyBaseStyle =
    "border border-neoBlue/70 bg-neoDark/40 rounded-md shadow-[0_0_15px_#00eaff80] transition-all duration-200";

  const H_STD = "h-[50px]";
  const GAP = "gap-3";

  const getKeyClass = (label) => {
    if (isHighlighted(label))
      return "border-pink-500 shadow-[0_0_25px_#ff00e6] text-pink-400";

    if (!isAllowed(label)) return "opacity-20";

    return "text-cyan-300";
  };

  const renderLabel = (label) => {
    if (!showLabels) return null;
    if (!isAllowed(label)) return null;

    return (
      <span className={isHighlighted(label) ? "text-pink-400" : "text-cyan-300"}>
        {label.toUpperCase()}
      </span>
    );
  };

  return (
  <div
  className={`
    w-full max-w-[1100px] mx-auto p-8 rounded-2xl select-none
    bg-neoDark/40 transition-all duration-150
    ${errorFlash
      ? "shadow-[0_0_15px_#ff0033] border-red-500"
      : "shadow-[0_0_20px_#00eaff55] border-neoBlue/40"
    }
  `}
>
      <div className={`flex flex-col ${GAP}`}>

        {KEYBOARD_LAYOUT.map((row, i) => (
          <div key={i} className={`flex justify-center ${GAP}`}>
            {row.map((keyData, j) => {
              const label = keyData.label;

              return (
                <div
                  key={j}
                  className={`${keyBaseStyle} ${keyData.w} ${H_STD} 
                  flex items-center justify-center ${getKeyClass(label)}`}
                >
                  {renderLabel(label)}
                </div>
              );
            })}
          </div>
        ))}

        {/* Bottom row */}
        <div className={`flex justify-center ${GAP} mt-3`}>

          {/* Left modifiers */}
          <div className={`flex ${GAP}`}>
            {[W_FN, W_CONTROL, W_OPTION, W_COMMAND].map((w, idx) => (
  <div key={idx} className={`${keyBaseStyle} ${w} ${H_STD} opacity-20`} />
))}

          </div>

          {/* Space */}
          <div className={`${keyBaseStyle} ${W_SPACE} ${H_STD} opacity-20`} />

          {/* Right modifiers */}
          <div className={`flex ${GAP}`}>
            {[W_COMMAND, W_OPTION].map((w, idx) => (
              <div key={idx} className={`${keyBaseStyle} ${w} ${H_STD} opacity-20`} />
            ))}
          </div>

          {/* Arrows */}
          <div className={`flex ${GAP}`}>
            <div className={`${keyBaseStyle} ${W_STD} ${H_STD} opacity-20`} />
            <div className="flex flex-col gap-1">
              <div className={`${keyBaseStyle} ${W_STD} h-[24px] opacity-20`} />
              <div className={`${keyBaseStyle} ${W_STD} h-[24px] opacity-20`} />
            </div>
            <div className={`${keyBaseStyle} ${W_STD} ${H_STD} opacity-20`} />
          </div>
        </div>
      </div>
    </div>
  );
}
