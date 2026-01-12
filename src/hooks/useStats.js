import { useEffect, useState } from "react";
import { loadSessions } from "../data/statsStore";
import { onStatsUpdate } from "../data/statsEvents";

export default function useStats() {
  const [sessions, setSessions] = useState(() => loadSessions());

  useEffect(() => {
    const off = onStatsUpdate(() => {
      setSessions(loadSessions());
    });
    return off;
  }, []);

  return { sessions };
}
