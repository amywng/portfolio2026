import { useEffect, useRef, useState } from "react";

export const useVimCommands = (scrollAmount: number = 150) => {
  const [cmdBuffer, setCmdBuffer] = useState("");
  const colonMode = useRef(false);
  const bufferRef = useRef("");
  const lastG = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement;
      const tag = active?.tagName ?? "";
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "BUTTON" ||
        tag === "A" ||
        (active as HTMLElement)?.isContentEditable
      )
        return;

      // Escape always resets
      if (event.key === "Escape") {
        colonMode.current = false;
        bufferRef.current = "";
        setCmdBuffer("");
        return;
      }

      // Colon activates ex command mode
      if (event.key === ":" && !colonMode.current) {
        event.preventDefault();
        colonMode.current = true;
        bufferRef.current = ":";
        setCmdBuffer(":");
        return;
      }

      // Ex command mode — buffer until Enter
      if (colonMode.current) {
        event.preventDefault();

        if (event.key === "Enter") {
          executeExCommand(bufferRef.current);
          colonMode.current = false;
          bufferRef.current = "";
          setCmdBuffer("");
          return;
        }

        if (event.key === "Backspace") {
          const next = bufferRef.current.slice(0, -1);
          if (next === "") {
            colonMode.current = false;
            bufferRef.current = "";
            setCmdBuffer("");
          } else {
            bufferRef.current = next;
            setCmdBuffer(next);
          }
          return;
        }

        if (event.key.length === 1) {
          const next = bufferRef.current + event.key;
          bufferRef.current = next;
          setCmdBuffer(next);
        }
        return;
      }

      // Normal mode commands
      switch (event.code) {
        case "KeyJ":
          window.scrollBy({ top: scrollAmount, behavior: "smooth" });
          break;
        case "KeyK":
          window.scrollBy({ top: -scrollAmount, behavior: "smooth" });
          break;
        case "KeyG": {
          const now = Date.now();
          if (event.shiftKey) {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          } else if (now - lastG.current < 400) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            lastG.current = 0;
          } else {
            lastG.current = now;
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollAmount]);

  return { cmdBuffer };
};

function executeExCommand(cmd: string) {
  const trimmed = cmd.trim();

  // :N — scroll to N% of page height (:1 = top)
  if (/^:\d+$/.test(trimmed)) {
    const num = parseInt(trimmed.slice(1), 10);
    if (num <= 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: (num / 100) * document.body.scrollHeight,
        behavior: "smooth",
      });
    }
    return;
  }

  switch (trimmed) {
    case ":q":
    case ":q!":
    case ":wq":
      showToast("winners never quit and quitters never win");
      break;
    default:
      showToast(`unknown command: ${trimmed}`);
      break;
  }
}

function showToast(msg: string) {
  const existing = document.getElementById("vim-toast");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.id = "vim-toast";
  el.textContent = msg;
  el.style.cssText = `
    position:fixed; bottom:48px; right:16px; z-index:9999;
    font-family:var(--font-plex-mono); font-size:11px;
    background:#16181D; color:#FCFCFA;
    padding:6px 12px; border-radius:4px;
    opacity:1; transition:opacity 0.3s;
  `;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
  }, 1800);
  setTimeout(() => el.remove(), 2100);
}
