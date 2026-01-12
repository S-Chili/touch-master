const EVENT_NAME = "tm_stats_update";

export function emitStatsUpdate() {
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function onStatsUpdate(cb) {
  window.addEventListener(EVENT_NAME, cb);
  return () => window.removeEventListener(EVENT_NAME, cb);
}
