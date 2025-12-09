"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ChaosSpinnerProps {
  id: number;
  onComplete: (id: number) => void;
  difficulty: number;
}

const SPINNER_MESSAGES = [
  "Spinning eternally...",
  "Calculating something important...",
  "Pretending to work...",
  "Generating random numbers...",
  "Contemplating existence...",
  "Buffering the buffer buffer...",
  "Waiting for the heat death of the universe...",
  "Spinning to win...",
  "Round and round we go...",
  "This is fine. Everything is fine.",
];

export const ChaosSpinner = ({ id, onComplete, difficulty }: ChaosSpinnerProps) => {
  const [rotations, setRotations] = useState(0);
  const [targetRotations, setTargetRotations] = useState(10 + difficulty * 5);
  const [speed, setSpeed] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isStuck, setIsStuck] = useState(false);
  const [message, setMessage] = useState(SPINNER_MESSAGES[0]);
  const [clickPower, setClickPower] = useState(0);

  // Chaos events
  useEffect(() => {
    const interval = setInterval(() => {
      if (rotations >= targetRotations) return;
      
      const rand = Math.random();
      
      // Random direction flip
      if (rand < 0.02 * difficulty) {
        setDirection(prev => -prev);
      }
      
      // Random speed change
      if (rand < 0.05) {
        setSpeed(0.1 + Math.random() * 2);
      }
      
      // Random stuck
      if (rand < 0.03 * difficulty && !isStuck) {
        setIsStuck(true);
      }
      
      // Random message
      if (rand < 0.1) {
        setMessage(SPINNER_MESSAGES[Math.floor(Math.random() * SPINNER_MESSAGES.length)]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [difficulty, isStuck, rotations, targetRotations]);

  // Rotation counter
  useEffect(() => {
    if (rotations >= targetRotations) {
      onComplete(id);
      return;
    }

    const interval = setInterval(() => {
      if (!isStuck) {
        setRotations(prev => {
          const increment = 0.1 * speed * direction + clickPower;
          setClickPower(prev => Math.max(0, prev - 0.01)); // Decay click power
          return Math.max(0, prev + increment);
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isStuck, speed, direction, clickPower, id, onComplete, rotations, targetRotations]);

  const handleClick = () => {
    if (isStuck) {
      setIsStuck(false);
    }
    setClickPower(prev => Math.min(0.5, prev + 0.1));
  };

  const progress = (rotations / targetRotations) * 100;

  return (
    <motion.div
      onClick={handleClick}
      className={`p-6 rounded-xl border cursor-pointer transition-all ${
        isStuck 
          ? "bg-red-500/10 border-red-500/50" 
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      {/* Spinner */}
      <div className="flex justify-center mb-4">
        <motion.div
          animate={{ rotate: rotations * 360 }}
          transition={{ type: "tween", duration: 0.05 }}
          className={`w-20 h-20 border-4 rounded-full ${
            isStuck 
              ? "border-red-500 border-t-transparent" 
              : "border-primary border-t-transparent"
          }`}
          style={{
            animationPlayState: isStuck ? "paused" : "running",
          }}
        />
      </div>

      {/* Stats */}
      <div className="text-center space-y-2">
        <div className="text-lg font-bold">
          {rotations.toFixed(1)} / {targetRotations} rotations
        </div>
        <div className="text-xs text-muted-foreground">
          {isStuck ? (
            <span className="text-red-400 animate-pulse">⚠️ STUCK! Click to unstick!</span>
          ) : direction < 0 ? (
            <span className="text-yellow-400">🔄 Spinning backwards...</span>
          ) : (
            message
          )}
        </div>
        
        {/* Progress */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {Math.floor(progress)}% complete
        </div>
      </div>
    </motion.div>
  );
};
