"use client";

import { motion } from "framer-motion";

export default function ThemeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="relative flex h-8 w-14 items-center rounded-full border border-zinc-700 bg-zinc-800 p-0.5 transition-colors dark:border-zinc-700 dark:bg-zinc-800"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-[10px]">
        {/* Sun */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#71717a" : "#fbbf24"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
      <span className="absolute right-1.5 text-[10px]">
        {/* Moon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#a78bfa" : "#71717a"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* Thumb */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative z-10 h-6 w-6 rounded-full bg-white shadow-sm"
        style={{ marginLeft: isDark ? "auto" : "0px" }}
      />
    </button>
  );
}
