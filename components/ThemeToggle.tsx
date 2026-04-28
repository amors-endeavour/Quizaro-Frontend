"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`p-2.5 rounded-xl transition-all duration-300 ${
          theme === "light"
            ? "bg-white text-blue-600 shadow-md scale-105"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        }`}
        title="Light Mode"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2.5 rounded-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-blue-400 shadow-md scale-105"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        }`}
        title="Dark Mode"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2.5 rounded-xl transition-all duration-300 ${
          theme === "system"
            ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md scale-105"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        }`}
        title="System Preference"
      >
        <Monitor size={18} />
      </button>
    </div>
  );
}
