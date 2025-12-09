// src/context/useSettings.js
import { useContext } from "react";
import { SettingsContext } from "./SettingsContext.jsx";

export const useSettings = () => {
  return useContext(SettingsContext);
};
