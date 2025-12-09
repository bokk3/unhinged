"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface FleeingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const FleeingButton = ({ children, onClick }: FleeingButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fleeSpeed, setFleeSpeed] = useState(1);
  const [taunts] = useState([
    "Too slow!",
    "Catch me!",
    "Nope!",
    "Try again!",
    "Almost!",
    "Haha!",
    "So close!",
    "Give up?",
  ]);
  const [currentTaunt, setCurrentTaunt] = useState(children);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!containerRef. current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = rect.width - 150;
    const maxY = rect.height - 50;
    
    // Random direction, scaled by flee speed
    const newX = Math.random() * maxX * fleeSpeed;
    const newY = Math.random() * maxY * fleeSpeed;
    
    setPosition({ 
      x: Math.min(maxX, Math.max(0, newX)),
      y: Math.min(maxY, Math.max(0, newY))
    });
    
    // Increase speed
    setFleeSpeed(prev => Math.min(prev + 0.2, 3));
    
    // Random taunt
    if (Math.random() > 0.5) {
      setCurrentTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
    }
  };

  const handleClick = () => {
    // Unlikely to actually get clicked, but if so...
    setCurrentTaunt("HOW?!");
    onClick?.();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-32 border-2 border-dashed border-red-500/50 rounded-lg overflow-hidden"
    >
      <motion.button
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        className="absolute px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
      >
        {currentTaunt}
      </motion.button>
    </div>
  );
};
