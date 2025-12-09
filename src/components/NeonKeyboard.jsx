import React from "react";

export default function NeonKeyboard() {
  const key = "border border-neoBlue/70 bg-neoDark/40 rounded-md shadow-[0_0_15px_#00eaff80]";

  const rows = [
    Array(14).fill(""), // row 1
    Array(14).fill(""), // row 2
    Array(13).fill(""), // row 3
    Array(12).fill(""), // row 4
  ];

  return (
    <div
      className="
        w-full max-w-[1100px] mx-auto p-8 rounded-2xl
        border border-neoBlue/40
        shadow-[0_0_40px_#00eaff55]
        bg-neoDark/40
        select-none
      "
    >
      <div className="flex flex-col gap-4">

        {rows.map((row, i) => (
          <div key={i} className="flex justify-center gap-3">
            {row.map((_, j) => (
              <div
                key={j}
                className={`${key} w-[58px] h-[50px]`}
              />
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-3 mt-3">

          <div className="flex gap-3">
            {Array(6)
              .fill("")
              .map((_, i) => (
                <div key={i} className={`${key} w-[58px] h-[50px]`} />
              ))}
          </div>

          <div className={`${key} w-[350px] h-[50px] rounded-md`} />

          <div className="flex gap-3">
            <div className={`${key} w-[58px] h-[50px]`} />
            <div className={`${key} w-[58px] h-[50px]`} />
          </div>

          <div className="flex gap-3">

            <div className={`${key} w-[70px] h-[50px]`} />

            <div className="flex flex-col gap-3">
              <div className={`${key} w-[58px] h-[23px]`} />
              <div className={`${key} w-[58px] h-[23px]`} />
            </div>

            <div className={`${key} w-[70px] h-[50px]`} />
          </div>
        </div>
      </div>
    </div>
  );
}