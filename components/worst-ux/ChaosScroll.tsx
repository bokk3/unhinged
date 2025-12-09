"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ChaosScrollProps {
  onScrollReversal?: () => void;
  children: React.ReactNode;
}

export const ChaosScroll = ({ onScrollReversal, children }: ChaosScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollMultiplier, setScrollMultiplier] = useState(1);
  const [isReversed, setIsReversed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Random chance to reverse direction (10% per scroll)
      if (Math.random() < 0.1) {
        setIsReversed(prev => !prev);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 500);
        onScrollReversal?.();
      }
      
      // Random speed multiplier (0.5x to 3x)
      const randomSpeed = 0.5 + Math.random() * 2.5;
      
      // Apply chaotic scroll
      const direction = isReversed ? -1 : 1;
      const delta = e.deltaY * direction * randomSpeed;
      container.scrollTop += delta;
      
      // Random "back to top" jump (2% chance)
      if (Math.random() < 0.02) {
        container.scrollTo({ top: 0, behavior: "smooth" });
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 500);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [isReversed, onScrollReversal]);

  return (
    <div className="relative h-full">
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide"
      >
        {children}
      </div>
      
      {/* Warning flash */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-red-500/30 pointer-events-none flex items-center justify-center"
        >
          <span className="text-4xl font-black text-white animate-pulse">
            {isReversed ? "↑ REVERSED ↓" : "SCROLL HIJACKED!"}
          </span>
        </motion.div>
      )}
      
      {/* Scroll direction indicator */}
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 rounded-full text-xs font-mono">
        {isReversed ? "Reversed Mode 🔄" : "Normal Mode"}
      </div>
    </div>
  );
};
