// src/context/useSettings.js
import { useContext } from "react";
import { SettingsContext } from "./SettingsContext.jsx"; // 1. ІМПОРТ З НОВОГО ФАЙЛУ

// Хук для зручного використання контексту
export const useSettings = () => {
  return useContext(SettingsContext);
};
