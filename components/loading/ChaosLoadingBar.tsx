"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ChaosLoadingBarProps {
  id: number;
  onComplete: (id: number) => void;
  difficulty: number;
}

const LOADING_MESSAGES = [
  "Loading...",
  "Please wait...",
  "Almost there...",
  "Reticulating splines...",
  "Convincing electrons to cooperate...",
  "Bribing the server hamsters...",
  "Defragmenting the mainframe...",
  "Downloading more RAM...",
  "Adjusting flux capacitor...",
  "Reversing the polarity...",
  "Consulting the oracle...",
  "Warming up the internet...",
  "Generating witty loading message...",
  "Loading loading bar...",
  "Preparing to prepare...",
  "Syncing syncs...",
  "Buffering buffer...",
  "Computing computations...",
  "Processing processes...",
  "Initializing initialization...",
];

const STALL_MESSAGES = [
  "Hmm, that's not good...",
  "The bar is shy today.",
  "Try clicking to encourage it!",
  "It needs motivation!",
  "Blow into your mic! (seriously)",
  "Shake the window!",
  "The progress is on strike.",
  "Have you tried turning it off and on?",
  "Error 418: I'm a teapot.",
  "Progress.exe has stopped responding.",
];

export const ChaosLoadingBar = ({ id, onComplete, difficulty }: ChaosLoadingBarProps) => {
  const [progress, setProgress] = useState(0);
  const [isStalled, setIsStalled] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);
  const [stallMessage, setStallMessage] = useState("");
  const [clicks, setClicks] = useState(0);
  const [color, setColor] = useState("hsl(var(--primary))");
  const [isGlitching, setIsGlitching] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Random chaos events
  useEffect(() => {
    const chaos = () => {
      if (progress >= 100) return;
      
      const rand = Math.random();
      
      // Stall at 99% (high chance)
      if (progress >= 95 && progress < 100 && rand < 0.3 * difficulty) {
        setIsStalled(true);
        setStallMessage(STALL_MESSAGES[Math.floor(Math.random() * STALL_MESSAGES.length)]);
        return;
      }
      
      // Random stall
      if (rand < 0.05 * difficulty && !isStalled) {
        setIsStalled(true);
        setStallMessage(STALL_MESSAGES[Math.floor(Math.random() * STALL_MESSAGES.length)]);
      }
      
      // Random reverse
      if (rand < 0.03 * difficulty && !isReversing && progress > 20) {
        setIsReversing(true);
        setTimeout(() => setIsReversing(false), 2000 + Math.random() * 3000);
      }
      
      // Random color change
      if (rand < 0.02) {
        const hue = Math.floor(Math.random() * 360);
        setColor(`hsl(${hue}, 70%, 50%)`);
      }
      
      // Random glitch
      if (rand < 0.01) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
      }
      
      // Random speed change
      if (rand < 0.05) {
        setSpeed(0.2 + Math.random() * 2);
      }
    };

    const interval = setInterval(chaos, 500);
    return () => clearInterval(interval);
  }, [progress, difficulty, isStalled, isReversing]);

  // Progress ticker
  useEffect(() => {
    if (progress >= 100) {
      onComplete(id);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!isStalled) {
        setProgress(prev => {
          const change = isReversing ? -0.5 * speed : (0.1 + Math.random() * 0.5) * speed;
          const newProgress = Math.max(0, Math.min(100, prev + change));
          
          // Update message
          if (Math.random() < 0.05) {
            setMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
          }
          
          return newProgress;
        });
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStalled, isReversing, speed, id, onComplete, progress]);

  // Click to unstall
  const handleClick = () => {
    setClicks(prev => prev + 1);
    
    if (isStalled) {
      // Need multiple clicks to unstall
      if (clicks >= 2 + Math.floor(difficulty)) {
        setIsStalled(false);
        setClicks(0);
        setProgress(prev => Math.min(100, prev + 1));
      }
    } else {
      // Clicking speeds it up slightly
      setProgress(prev => Math.min(100, prev + 0.5));
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      animate={{
        x: isGlitching ? [0, -5, 5, -3, 3, 0] : 0,
        rotate: isGlitching ? [0, -1, 1, -1, 0] : 0,
      }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isStalled 
          ? "bg-red-500/10 border-red-500/50 animate-pulse" 
          : isReversing 
          ? "bg-yellow-500/10 border-yellow-500/50"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Loading Bar #{id}</span>
        <span className="text-xs text-muted-foreground">
          {Math.floor(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-6 bg-secondary rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full transition-all duration-100"
          style={{ 
            width: `${progress}%`,
            backgroundColor: color,
          }}
          animate={{
            opacity: isGlitching ? [1, 0, 1, 0, 1] : 1,
          }}
        />
        
        {/* Percentage text on bar */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
          {Math.floor(progress)}%
        </div>
      </div>

      {/* Message */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        {isStalled ? (
          <span className="text-red-400 animate-pulse">{stallMessage}</span>
        ) : isReversing ? (
          <span className="text-yellow-400">🔄 Progress reversing...</span>
        ) : (
          message
        )}
      </div>

      {/* Stall click counter */}
      {isStalled && (
        <div className="mt-2 text-center">
          <span className="text-xs text-muted-foreground">
            Clicks to fix: {clicks}/{3 + Math.floor(difficulty)}
          </span>
        </div>
      )}
    </motion.div>
  );
};
