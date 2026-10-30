import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "navy" | "teal" | "emerald" | "gold" | "rose" | "neutral" | "outline";
}

export function Badge({ className, variant = "navy", ...props }: BadgeProps) {
  const variantStyles = {
    navy: "bg-sandigan-navy-100 text-sandigan-navy-800 dark:bg-sandigan-navy-700 dark:text-sandigan-navy-100",
    teal: "bg-sandigan-teal-50 text-sandigan-teal-700 dark:bg-sandigan-teal-900/40 dark:text-sandigan-teal-300",
    emerald: "bg-sandigan-emerald-50 text-sandigan-emerald-700 dark:bg-sandigan-emerald-900/40 dark:text-sandigan-emerald-300",
    gold: "bg-sandigan-gold-100 text-sandigan-gold-900 dark:bg-sandigan-gold-900/40 dark:text-sandigan-gold-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    outline: "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
