import { useState } from "react";

export function useStorage(key, def) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : def;
    } catch {
      return def;
    }
  });
  const save = (v) => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  };
  return [val, save];
}
