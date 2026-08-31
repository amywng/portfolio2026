"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isTouch || reducedMotion || isSafari) return;

    document.body.classList.add("cursor-none");
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set position directly on mousemove — no rAF delay, transform avoids layout
    function onMove(e: MouseEvent) {
      if (!cursor) return;
      cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    }

    // Trail dots throttled to ~30ms so we don't flood the DOM
    let lastDot = 0;
    function onMoveTrail(e: MouseEvent) {
      const now = Date.now();
      if (now - lastDot < 30) return;
      lastDot = now;
      const dot = document.createElement("div");
      dot.className = "cursor-trail-dot";
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      document.body.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
    }

    function onOver(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("[data-cursor-hover]");
      cursor?.classList.toggle("cursor-hover-active", Boolean(target));
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousemove", onMoveTrail, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onMoveTrail);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("cursor-none");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="ink-cursor"
      className="fixed top-0 left-0 w-3.5 h-3.5 rounded-full border-[1.5px] border-ink
                 pointer-events-none z-[9999]
                 transition-[width,height,border-color,background] duration-150 ease-out
                 hidden md:block"
    />
  );
}
