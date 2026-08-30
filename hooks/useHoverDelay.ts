import { useRef, useState } from "react";

export function useHoverDelay<T>(delay = 120) {
  const [value, setValue] = useState<T | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(v: T) {
    if (timer.current) clearTimeout(timer.current);
    setValue(v);
  }

  function hide() {
    timer.current = setTimeout(() => setValue(null), delay);
  }

  function keep() {
    if (timer.current) clearTimeout(timer.current);
  }

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    setValue(null);
  }

  return { value, show, hide, keep, clear };
}
