import React, { useMemo } from "react";
import { KEYBOARD_ROWS } from "../data/keyboardLayouts";

const H_STD = "h-[50px]";
const GAP = "gap-3";

const W_STD = "w-[58px]";
const W_FN = "w-[58px]";
const W_CONTROL = "w-[70px]";
const W_OPTION = "w-[65px]";
const W_COMMAND = "w-[80px]";
const W_SPACE = "w-[280px]";

export default function NeonKeyboard({
  showLabels = false,
  highlightCodes = [],
  allowedCodes = [],
  errorFlash = false,
  layout = "en",
}) {
  const highlightSet = useMemo(() => new Set(highlightCodes), [highlightCodes]);
  const allowedSet = useMemo(() => new Set(allowedCodes), [allowedCodes]);

  const keyBaseStyle =
    "border border-neoBlue/70 bg-neoDark/40 rounded-md shadow-[0_0_15px_#00eaff80] transition-all duration-200";

  const getKeyClass = (code) => {
    if (code && highlightSet.has(code)) {
      return "border-pink-500 shadow-[0_0_25px_#ff00e6] text-pink-400";
    }
    if (code && allowedSet.has(code)) return "text-cyan-300";
    return "opacity-20";
  };

  const getLabel = (keyData) => {
    if (!showLabels) return null;
    if (keyData.label) return keyData.label.toUpperCase(); 
    const text = layout === "uk" ? keyData.labelUk : keyData.labelEn;
    return (text ?? "").toUpperCase();
  };

  return (
    <div
      className={`
        w-full max-w-[1100px] mx-auto p-8 rounded-2xl select-none
        bg-neoDark/40 transition-all duration-150
        ${errorFlash
          ? "shadow-[0_0_15px_#ff0033] border-red-500"
          : "shadow-[0_0_20px_#00eaff55] border-neoBlue/40"}
      `}
    >
      <div className={`flex flex-col ${GAP}`}>
        {KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className={`flex justify-center ${GAP}`}>
            {row.map((keyData, j) => (
              <div
                key={j}
                className={`${keyBaseStyle} ${keyData.w} ${H_STD} flex items-center justify-center ${getKeyClass(
                  keyData.code
                )}`}
              >
                {showLabels ? (
                  <span
                    className={
                      keyData.code && highlightSet.has(keyData.code)
                        ? "text-pink-400"
                        : "text-cyan-300"
                    }
                  >
                    {getLabel(keyData)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ))}

        <div className={`flex justify-center ${GAP} mt-3`}>
          <div className={`flex ${GAP}`}>
            {[W_FN, W_CONTROL, W_OPTION, W_COMMAND].map((w, idx) => (
              <div key={idx} className={`${keyBaseStyle} ${w} ${H_STD} opacity-20`} />
            ))}
          </div>

          <div className={`${keyBaseStyle} ${W_SPACE} ${H_STD} opacity-20`} />

          <div className={`flex ${GAP}`}>
            {[W_COMMAND, W_OPTION].map((w, idx) => (
              <div key={idx} className={`${keyBaseStyle} ${w} ${H_STD} opacity-20`} />
            ))}
          </div>

          <div className={`flex ${GAP}`}>
            <div className={`${keyBaseStyle} ${W_STD} ${H_STD} opacity-20`} />
            <div className="flex flex-col gap-1">
              <div className={`${keyBaseStyle} ${W_STD} h-6 opacity-20`} />
              <div className={`${keyBaseStyle} ${W_STD} h-6 opacity-20`} />
            </div>
            <div className={`${keyBaseStyle} ${W_STD} ${H_STD} opacity-20`} />
          </div>
        </div>
      </div>
    </div>
  );
}
