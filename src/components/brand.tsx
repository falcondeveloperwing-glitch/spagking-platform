"use client";
import { useState } from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
  variant?: "full" | "mark" | "original";
}

export function SpagKingLogo({ size = 40, showText = true, textClassName = "", variant = "full" }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: size, height: size }} className="relative shrink-0">
        <img
          src={variant === "mark" ? "/spagking-mark.svg" : variant === "original" ? "/spagking-logo-original.jpg" : "/spagking-logo.svg"}
          alt="SpagKing"
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <div className={`leading-none ${textClassName}`}>
          <span className="wordmark text-[1.4em]">SpagKing</span>
        </div>
      )}
    </div>
  );
}

interface MealImageProps {
  src: string;
  emoji: string;
  alt: string;
  className?: string;
}

export function MealImage({ src, emoji, alt, className = "" }: MealImageProps) {
  return <MealImageInner key={src} src={src} emoji={emoji} alt={alt} className={className} />;
}

function MealImageInner({ src, emoji, alt, className = "" }: MealImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (errored || !src) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#1C1C1C] via-[#101010] to-[#050505] ${className}`}>
        <span className="text-5xl drop-shadow-lg opacity-90">{emoji}</span>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,215,0,0.10),transparent_60%)]" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
      />
    </div>
  );
}
