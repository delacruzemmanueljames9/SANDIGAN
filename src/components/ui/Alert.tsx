import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, PhoneCall } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "success" | "danger" | "crisis";
  title?: string;
  icon?: React.ReactNode;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  icon,
  ...props
}: AlertProps) {
  const variantStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-200",
    warning: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200",
    danger: "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200",
    crisis: "bg-rose-600 border-rose-700 text-white shadow-md dark:bg-rose-700 dark:border-rose-800",
  };

  const defaultIcons = {
    info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    crisis: <PhoneCall className="w-5 h-5 text-white animate-pulse shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3.5 rounded-2xl border p-4 text-sm leading-relaxed",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <div className="pt-0.5">{icon || defaultIcons[variant]}</div>
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-heading font-semibold tracking-tight">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
