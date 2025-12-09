"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface VUMeterProps {
  volume: number;
  threshold: number;
}

export const VUMeter = ({ volume, threshold }: VUMeterProps) => {
  const [peaks, setPeaks] = useState<number[]>(Array(20).fill(0));

  // Smooth out the volume for visualization
  useEffect(() => {
    // Shift peaks down
    setPeaks(prev => {
      const newPeaks = [...prev.slice(1), volume];
      return newPeaks;
    });
  }, [volume]);

  const isOverThreshold = volume >= threshold;

  return (
    <div className="w-16 h-96 bg-black/80 rounded-lg p-2 flex flex-col justify-end gap-1 border border-border relative overflow-hidden">
      {/* Threshold Line */}
      <div 
        className="absolute w-full h-0.5 bg-white z-10 pointer-events-none transition-all duration-200"
        style={{ bottom: `${threshold}%` }}
      />
      
      {/* Bars */}
      {Array.from({ length: 40 }).map((_, i) => {
        const heightPercent = (i + 1) * 2.5;
        const isActive = volume >= heightPercent;
        
        let color = "bg-green-500";
        if (heightPercent > 60) color = "bg-yellow-500";
        if (heightPercent > 85) color = "bg-red-500";

        return (
          <div
            key={i}
            className={`w-full h-1 rounded-sm transition-all duration-75 ${
              isActive ? color : "bg-gray-800/50"
            } ${isActive && isOverThreshold && heightPercent > threshold ? "animate-pulse brightness-150" : ""}`}
          />
        );
      })}
      
      {/* Digital Readout */}
      <div className="absolute top-2 left-0 w-full text-center font-mono text-xs font-bold text-white">
        {volume} dB
      </div>
    </div>
  );
};
