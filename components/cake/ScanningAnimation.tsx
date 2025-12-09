"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ScanningAnimationProps {
  imageUrl: string;
  onComplete: (isCake: boolean) => void;
}

const SCANNING_PHASES = [
  { text: "Initializing cake detection AI...", duration: 800 },
  { text: "Analyzing pixel density...", duration: 600 },
  { text: "Checking for fondant signatures...", duration: 700 },
  { text: "Detecting frosting patterns...", duration: 500 },
  { text: "Measuring sponge probability...", duration: 600 },
  { text: "Cross-referencing with cake database...", duration: 800 },
  { text: "Consulting pastry experts...", duration: 500 },
  { text: "Running deep batter analysis...", duration: 700 },
  { text: "Verifying structural integrity...", duration: 600 },
  { text: "Final cake determination...", duration: 1000 },
];

export const ScanningAnimation = ({ imageUrl, onComplete }: ScanningAnimationProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanLineY, setScanLineY] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (currentPhase < SCANNING_PHASES.length) {
      const phase = SCANNING_PHASES[currentPhase];
      timeout = setTimeout(() => {
        setCurrentPhase(prev => prev + 1);
        setProgress(((currentPhase + 1) / SCANNING_PHASES.length) * 100);
      }, phase.duration);
    } else {
      // Random result: 60% chance it's cake
      const isCake = Math.random() < 0.6;
      onComplete(isCake);
    }

    return () => clearTimeout(timeout);
  }, [currentPhase, onComplete]);

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLineY(prev => (prev + 2) % 100);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Image with scanning effect */}
      <div className="relative rounded-2xl overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Being scanned" 
          className="w-full h-64 object-cover filter brightness-75"
        />
        
        {/* Scan line */}
        <motion.div
          animate={{ top: `${scanLineY}%` }}
          transition={{ type: "tween", duration: 0.02 }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ boxShadow: "0 0 20px var(--primary)" }}
        />

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Scanning corners */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary" />
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-primary" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-primary" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary" />

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-2 bg-black/70 rounded-lg">
            <span className="text-primary font-mono text-sm animate-pulse">
              ANALYZING...
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-full bg-gradient-to-r from-primary to-purple-500"
          />
        </div>
        <p className="text-sm text-center text-muted-foreground font-mono">
          {currentPhase < SCANNING_PHASES.length 
            ? SCANNING_PHASES[currentPhase].text 
            : "Processing results..."}
        </p>
      </div>

      {/* Fake metrics */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-secondary/50 rounded-lg">
          <div className="text-xs text-muted-foreground">Cake Probability</div>
          <div className="text-lg font-bold text-primary">
            {Math.floor(progress * 0.6 + Math.random() * 20)}%
          </div>
        </div>
        <div className="p-2 bg-secondary/50 rounded-lg">
          <div className="text-xs text-muted-foreground">Fondant Level</div>
          <div className="text-lg font-bold text-yellow-500">
            {Math.floor(Math.random() * 100)}%
          </div>
        </div>
        <div className="p-2 bg-secondary/50 rounded-lg">
          <div className="text-xs text-muted-foreground">Frosting Index</div>
          <div className="text-lg font-bold text-pink-500">
            {Math.floor(Math.random() * 100)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};
