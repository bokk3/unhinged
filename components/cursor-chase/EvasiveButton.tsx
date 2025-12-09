"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EvasiveButtonProps {
  id: number;
  onCatch: (id: number) => void;
  onSplit: (id: number, position: { x: number; y: number }) => void;
  initialPosition?: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
  evasionRadius?: number;
  size?: "normal" | "small" | "tiny";
}

const TAUNTS = [
  "Too slow!",
  "Almost!",
  "Nope!",
  "Try again!",
  "Catch me!",
  "Missed!",
  "So close!",
  "Haha!",
  "Not today!",
  "Keep trying!",
];

export const EvasiveButton = ({
  id,
  onCatch,
  onSplit,
  initialPosition,
  containerRef,
  evasionRadius = 100,
  size = "normal",
}: EvasiveButtonProps) => {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [taunt, setTaunt] = useState("Click me!");
  const [evasionCount, setEvasionCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    normal: "px-8 py-4 text-lg",
    small: "px-4 py-2 text-sm",
    tiny: "px-2 py-1 text-xs",
  };

  const buttonSize = {
    normal: { width: 150, height: 56 },
    small: { width: 100, height: 36 },
    tiny: { width: 60, height: 24 },
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      const buttonCenterX = position.x + buttonSize[size].width / 2;
      const buttonCenterY = position.y + buttonSize[size].height / 2;

      const distance = Math.sqrt(
        Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
      );

      if (distance < evasionRadius) {
        // Calculate escape direction (opposite of mouse)
        const angle = Math.atan2(buttonCenterY - mouseY, buttonCenterX - mouseX);
        const escapeDistance = evasionRadius + 50 + Math.random() * 100;

        let newX = buttonCenterX + Math.cos(angle) * escapeDistance - buttonSize[size].width / 2;
        let newY = buttonCenterY + Math.sin(angle) * escapeDistance - buttonSize[size].height / 2;

        // Keep within bounds
        const maxX = containerRect.width - buttonSize[size].width;
        const maxY = containerRect.height - buttonSize[size].height;
        newX = Math.max(0, Math.min(maxX, newX));
        newY = Math.max(0, Math.min(maxY, newY));

        // Check if cornered (hit multiple edges)
        const isCornerX = newX <= 10 || newX >= maxX - 10;
        const isCornerY = newY <= 10 || newY >= maxY - 10;

        if (isCornerX && isCornerY && size === "normal" && evasionCount > 5) {
          // Split into two smaller buttons!
          onSplit(id, { x: newX, y: newY });
          return;
        }

        setPosition({ x: newX, y: newY });
        setEvasionCount(prev => prev + 1);

        // Random taunt
        if (Math.random() > 0.7) {
          setTaunt(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
        }

        // Shake effect
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 100);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [position, containerRef, evasionRadius, size, evasionCount, id, onSplit]);

  const handleClick = () => {
    setTaunt("IMPOSSIBLE!");
    onCatch(id);
  };

  return (
    <motion.button
      ref={buttonRef}
      animate={{
        x: position.x,
        y: position.y,
        rotate: isShaking ? 5 : 0,
      }}
      transition={{ 
        x: { type: "spring", stiffness: 400, damping: 25 },
        y: { type: "spring", stiffness: 400, damping: 25 },
        rotate: { type: "tween", duration: 0.1 },
      }}
      onClick={handleClick}
      className={`absolute ${sizeClasses[size]} bg-primary text-primary-foreground rounded-lg font-bold shadow-lg hover:shadow-xl transition-shadow border-2 border-primary-foreground/20`}
    >
      {taunt}
    </motion.button>
  );
};
