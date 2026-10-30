import * as React from "react";
import { cn } from "@/lib/utils";

export interface SandiganLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
}

export function SandiganLogo({
  className,
  size = "md",
  showText = true,
  showTagline = false,
  ...props
}: SandiganLogoProps) {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const titleSizes = {
    sm: "text-base tracking-wider",
    md: "text-lg tracking-wider",
    lg: "text-2xl tracking-widest",
    xl: "text-3xl tracking-widest",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)} {...props}>
      {/* SVG Shield & Interlocking S Symbol */}
      <div className={cn("relative shrink-0 flex items-center justify-center", iconDimensions[size])}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Shield Outline Gradient Definition */}
          <defs>
            <linearGradient id="shieldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#101B35" />
              <stop offset="0.5" stopColor="#159A9A" />
              <stop offset="1" stopColor="#16845B" />
            </linearGradient>
            <linearGradient id="goldAcc" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F4E4C0" />
              <stop offset="0.5" stopColor="#D6AE57" />
              <stop offset="1" stopColor="#BD9338" />
            </linearGradient>
          </defs>

          {/* Protective Shield Base */}
          <path
            d="M50 8C68 18 84 20 88 38C91 58 76 78 50 94C24 78 9 58 12 38C16 20 32 18 50 8Z"
            fill="url(#shieldGrad)"
          />

          {/* Supportive Embracing Human Figure / Abstract 'S' Curves */}
          <path
            d="M50 24C44 24 40 28 40 33C40 42 60 44 60 54C60 60 54 64 48 64C41 64 36 60 34 54"
            stroke="url(#goldAcc)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Sanctuary Core Anchor */}
          <circle cx="50" cy="20" r="4.5" fill="#D6AE57" />
          
          {/* Supportive Embrace Lower Arc */}
          <path
            d="M32 46C34 56 42 66 50 72C58 66 66 56 68 46"
            stroke="#FFFFFF"
            strokeOpacity="0.4"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-heading font-extrabold text-sandigan-navy dark:text-white leading-none", titleSizes[size])}>
            SANDIGAN
          </span>
          {showTagline && (
            <span className="text-[11px] text-slate-500 dark:text-sandigan-teal-300 font-medium tracking-normal mt-0.5">
              You don&apos;t have to carry it alone.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
