import React from "react";

const KEYBOARD_LAYOUT = [
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

export default function NeonKeyboard({ showLabels = false, highlightKeys = [] }) {
  const keyBase =
    "rounded-md border bg-neoDark/40 transition-all duration-200 flex items-center justify-center";

  const glowBlue = "border-neoBlue/70 shadow-[0_0_15px_#00eaff80]";
  const glowPink = "border-pink-500 shadow-[0_0_25px_#ff00e6] bg-pink-500/20";

  const H_STD = "h-[50px]";
  const GAP = "gap-3";

  const W_STD = "w-[58px]";
  const W_FN = "w-[58px]";
  const W_CONTROL = "w-[70px]";
  const W_OPTION = "w-[65px]";
  const W_COMMAND = "w-[80px]";
  const W_SPACE = "w-[280px]";

  const isHighlighted = (label) =>
    highlightKeys.includes(label.toLowerCase());

  return (
    <div
      className="
      w-full max-w-[1100px] mx-auto p-8 rounded-2xl
      border border-neoBlue/40 shadow-[0_0_40px_#00eaff55]
      bg-neoDark/40 select-none
    "
    >
      <div className={`flex flex-col ${GAP}`}>
        {/* TOP ROWS */}
        {KEYBOARD_LAYOUT.map((row, i) => (
          <div key={i} className={`flex justify-center ${GAP}`}>
            {row.map((key, j) => (
              <div
                key={j}
                className={`
                  ${keyBase} ${key.w} ${H_STD}
                  ${isHighlighted(key.label) ? glowPink : glowBlue}
                  text-lg text-gray-300
                `}
              >
                {showLabels ? key.label.toUpperCase() : ""}
              </div>
            ))}
          </div>
        ))}

        {/* BOTTOM ROW */}
        <div className={`flex justify-center ${GAP} mt-3`}>
          {/* LEFT */}
          <div className={`flex ${GAP}`}>
            {[["FN", W_FN], ["CONTROL", W_CONTROL], ["OPTION", W_OPTION], ["COMMAND", W_COMMAND]].map(
              ([label, width], i) => (
                <div
                  key={i}
                  className={`${keyBase} ${width} ${H_STD} ${glowBlue} text-xs text-gray-300`}
                >
                  {showLabels ? label : ""}
                </div>
              )
            )}
          </div>

          {/* SPACE */}
          <div className={`${keyBase} ${W_SPACE} ${H_STD} ${glowBlue}`} />

          {/* RIGHT */}
          <div className={`flex ${GAP}`}>
            {[["COMMAND", W_COMMAND], ["OPTION", W_OPTION]].map(([label, width], i) => (
              <div
                key={i}
                className={`${keyBase} ${width} ${H_STD} ${glowBlue} text-xs text-gray-300`}
              >
                {showLabels ? label : ""}
              </div>
            ))}
          </div>

          {/* ARROWS */}
          <div className={`flex ${GAP}`}>
            <div className={`${keyBase} ${W_STD} ${H_STD} ${glowBlue}`} />
            <div className="flex flex-col gap-1">
              <div className={`${keyBase} ${W_STD} h-[24px] ${glowBlue}`} />
              <div className={`${keyBase} ${W_STD} h-[24px] ${glowBlue}`} />
            </div>
            <div className={`${keyBase} ${W_STD} ${H_STD} ${glowBlue}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
