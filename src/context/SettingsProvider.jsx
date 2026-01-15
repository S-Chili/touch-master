import React, { useMemo, useState, useEffect } from "react";
import { SettingsContext } from "./SettingsContext.jsx";

const LS_KEY = "tm_settings_v1";

function readSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { language: "uk", layout: "en" };
    const parsed = JSON.parse(raw);

    return {
      language: parsed?.language === "en" ? "en" : "uk",
      layout: parsed?.layout === "uk" ? "uk" : "en",
    };
  } catch {
    return { language: "uk", layout: "en" };
  }
}

export default function SettingsProvider({ children }) {
  const [{ language, layout }, setSettings] = useState(() => readSettings());

  const setLanguage = (next) =>
    setSettings((s) => ({ ...s, language: next === "en" ? "en" : "uk" }));

  const setLayout = (next) =>
    setSettings((s) => ({ ...s, layout: next === "uk" ? "uk" : "en" }));

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ language, layout }));
    } catch {
      /* empty */
    }
  }, [language, layout]);

  const value = useMemo(
    () => ({ language, setLanguage, layout, setLayout }),
    [language, layout]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}