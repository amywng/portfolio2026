"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const SHORTCUTS = [
  { keys: ["gg", ":1"], description: "go to top of page" },
  { keys: ["G"],        description: "go to bottom of page" },
  { keys: ["d"],        description: "toggle dark / light mode" },
  { keys: ["."],        description: "toggle grid overlay" },
  { keys: ["?"],        description: "show keyboard shortcuts" },
  { keys: ["j"],        description: "scroll down" },
  { keys: ["k"],        description: "scroll up" },
  { keys: ["h"],        description: "go to home" },
];

const NAV_LINKS = [
  { href: "/#experience", label: "experience" },
  { href: "/art",         label: "art" },
  { href: "/currently",   label: "currently" },
  { href: "/elsewhere",   label: "elsewhere" },
];

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [grid, setGrid] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const toggleDark = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleGrid = useCallback(() => setGrid((g) => !g), []);
  const toggleShortcuts = useCallback(() => setShowShortcuts((s) => !s), []);

  useEffect(() => { setMenuOpen(false); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key.toLowerCase()) {
        case "d": toggleDark(); break;
        case ".": toggleGrid(); break;
        case "h": router.push("/"); break;
        case "?": toggleShortcuts(); break;
        case "escape":
          setShowShortcuts(false);
          setMenuOpen(false);
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleDark, toggleGrid, toggleShortcuts, router]);

  useEffect(() => {
    let el = document.getElementById("grid-overlay");
    if (grid) {
      if (!el) {
        el = document.createElement("div");
        el.id = "grid-overlay";
        document.body.appendChild(el);
      }
      el.style.cssText = `
        position:fixed;inset:0;pointer-events:none;z-index:1;
        background-image:
          repeating-linear-gradient(to right,rgba(43,75,255,.07) 0px,rgba(43,75,255,.07) 1px,transparent 1px,transparent 25px),
          repeating-linear-gradient(to bottom,rgba(43,75,255,.07) 0px,rgba(43,75,255,.07) 1px,transparent 1px,transparent 25px);
      `;
    } else {
      el?.remove();
    }
  }, [grid]);

  const isDark = mounted && theme === "dark";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/85 dark:bg-ink/85 backdrop-blur-sm border-b border-line dark:border-white/10">
        <div className="max-w-wide mx-auto px-5 md:px-7 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-mono text-[13px]" data-cursor-hover>
            amy /
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-ink-soft dark:text-white/80">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={label} href={href} className="hover:text-fuchsia transition-colors" data-cursor-hover>
                {label}
              </Link>
            ))}

            <span className="w-px h-3.5 bg-line dark:bg-white/10" aria-hidden />

            <div className="flex items-center gap-1">
              <IconButton onClick={toggleDark} title={isDark ? "light mode (D)" : "dark mode (D)"}>
                {mounted && isDark ? <SunIcon /> : <MoonIcon />}
              </IconButton>
              <div className="hidden md:flex items-center gap-1">
                <IconButton onClick={toggleGrid} title="grid overlay (.)" active={grid}>
                  <GridIcon />
                </IconButton>
                <IconButton onClick={toggleShortcuts} title="shortcuts (?)">
                  <KeyboardIcon />
                </IconButton>
              </div>
            </div>
          </div>

          {/* Mobile right side — dark toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <IconButton onClick={toggleDark} title={isDark ? "light mode" : "dark mode"}>
              {mounted && isDark ? <SunIcon /> : <MoonIcon />}
            </IconButton>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1.5 rounded text-ink-soft dark:text-white/50 hover:bg-ink/5 dark:hover:bg-white/5"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              data-cursor-hover
            >
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-line dark:border-white/10 bg-paper/95 dark:bg-ink/95 backdrop-blur-sm px-5 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="font-mono text-sm text-ink-soft dark:text-white/80 hover:text-fuchsia transition-colors"
                onClick={() => setMenuOpen(false)}
                data-cursor-hover
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Shortcuts modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          onClick={() => setShowShortcuts(false)}
        >
          <div className="absolute inset-0 bg-ink/30 dark:bg-ink/60 backdrop-blur-sm" />
          <div
            className="relative bg-paper dark:bg-ink border border-line dark:border-white/10 rounded-md p-6 w-[calc(100vw-2rem)] max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted dark:text-white/40 mb-4">
              keyboard shortcuts
            </p>
            <div className="space-y-3">
              {SHORTCUTS.map(({ keys, description }) => (
                <div key={description} className="flex items-center justify-between gap-4">
                  <span className="text-[13px] text-ink-soft dark:text-white/80">{description}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="font-mono text-[11px] border border-line dark:border-white/20 rounded px-2 py-0.5 text-ink dark:text-white/80 bg-paper dark:bg-white/5"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="absolute top-3 right-3 font-mono text-[11px] text-muted hover:text-ink dark:text-white/30 dark:hover:text-white"
            >
              esc
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function IconButton({ onClick, title, active, children }: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      data-cursor-hover
      className={`p-1.5 rounded transition-colors hover:bg-ink/5 dark:hover:bg-white/5
                  ${active ? "text-fuchsia" : "text-ink-soft dark:text-white/50"}`}
    >
      {children}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="13" rx="2"/>
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
