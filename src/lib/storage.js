// src/lib/storage.js
import { useEffect, useState } from "react";

export default function useLocalStorageState(key, fallback) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // abaikan
    }
  }, [key, state]);

  return [state, setState];
}
