"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const Knob = ({ value, onChange, min = 0, max = 100, label }: KnobProps) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate angle
      const deltaX = e.clientX - centerX;
      const deltaY = centerY - e.clientY; // Invert Y so up is positive
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // Normalize angle to 0-360 starting from bottom-left (-135deg) to bottom-right (315deg)
      // This is a bit tricky, let's simplify: map Y movement to value change
      // Actually, standard knob behavior is usually vertical drag or rotary follow.
      // Let's do vertical drag for simplicity and precision.
      
      const sensitivity = 2;
      const change = -e.movementY * sensitivity;
      const newValue = Math.min(max, Math.max(min, value + change));
      
      onChange(newValue);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, value, onChange, min, max]);

  // Convert value to rotation (-135 to 135 degrees)
  const percentage = (value - min) / (max - min);
  const rotation = -135 + (percentage * 270);

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div 
        ref={knobRef}
        className="relative w-24 h-24 rounded-full bg-neutral-800 border-4 border-neutral-700 shadow-xl cursor-ns-resize flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        {/* Indicator */}
        <motion.div 
          className="absolute w-full h-full rounded-full"
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        </motion.div>
        
        {/* Center Cap */}
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-primary font-mono font-bold text-lg border border-neutral-800">
          {Math.round(value)}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</span>}
    </div>
  );
};
