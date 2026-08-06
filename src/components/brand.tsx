"use client";
import { useState } from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export function SpagKingLogo({ size = 40, showText = true, textClassName = "" }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: size, height: size }} className="relative shrink-0">
        <img src="/spagking-logo.svg" alt="SpagKing" className="w-full h-full object-contain" />
      </div>
      {showText && (
        <div className={`leading-none ${textClassName}`}>
          <span className="block font-display font-extrabold tracking-tight text-[1.05em]">
            <span className="text-gold-gradient">Spag</span><span className="text-foreground">King</span>
          </span>
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
  // Use key to remount on src change so internal state resets naturally
  return <MealImageInner key={src} src={src} emoji={emoji} alt={alt} className={className} />;
}

function MealImageInner({ src, emoji, alt, className = "" }: MealImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (errored || !src) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-amber-500/20 via-yellow-600/10 to-amber-900/20 ${className}`}>
        <span className="text-5xl drop-shadow-lg">{emoji}</span>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,160,23,0.15),transparent_60%)]" />
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
        className={`w-full h-full object-cover transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
      />
    </div>
  );
}
