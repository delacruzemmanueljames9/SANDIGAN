"use client";

import * as React from "react";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const [lang, setLang] = React.useState<"en" | "tl">("en");

  React.useEffect(() => {
    const saved = localStorage.getItem("sandigan-lang") as "en" | "tl" | null;
    if (saved) setLang(saved);
  }, []);

  const toggleLanguage = () => {
    const next = lang === "en" ? "tl" : "en";
    setLang(next);
    localStorage.setItem("sandigan-lang", next);
    // Dispatch custom event so listeners can re-render if needed
    window.dispatchEvent(new CustomEvent("sandigan-lang-change", { detail: next }));
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-sandigan-navy-800 transition-colors"
      aria-label="Toggle language between English and Filipino"
      title="Switch Language: EN / TL"
    >
      <Languages className="w-3.5 h-3.5 text-sandigan-teal" />
      <span className="uppercase">{lang}</span>
    </button>
  );
}
