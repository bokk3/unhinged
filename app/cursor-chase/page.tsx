"use client";

import { useState, useEffect, useRef } from "react";
import { EvasiveButton } from "@/components/cursor-chase/EvasiveButton";
import { GameStats } from "@/components/cursor-chase/GameStats";
import { ArrowLeft, Target, Info, Moon, Sun, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ButtonState {
  id: number;
  position: { x: number; y: number };
  size: "normal" | "small" | "tiny";
}

export default function CursorChase() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [buttons, setButtons] = useState<ButtonState[]>([
    { id: 1, position: { x: 200, y: 200 }, size: "normal" },
  ]);
  const [catches, setCatches] = useState(0);
  const [escapes, setEscapes] = useState(0);
  const [splits, setSplits] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(2);

  const difficultySettings = {
    easy: { evasionRadius: 60, label: "Easy" },
    normal: { evasionRadius: 100, label: "Normal" },
    hard: { evasionRadius: 150, label: "Nightmare" },
  };

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Escape counter (button evades count as escapes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (buttons.length > 0) {
        setEscapes(prev => prev + 1);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [buttons.length]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleCatch = (id: number) => {
    setCatches(prev => prev + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);

    // Remove caught button
    setButtons(prev => prev.filter(b => b.id !== id));

    // Spawn a new button after delay
    setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setButtons(prev => [
          ...prev,
          {
            id: nextIdRef.current++,
            position: {
              x: Math.random() * (rect.width - 150),
              y: Math.random() * (rect.height - 56),
            },
            size: "normal",
          },
        ]);
      }
    }, 1000);
  };

  const handleSplit = (id: number, position: { x: number; y: number }) => {
    setSplits(prev => prev + 1);

    // Remove original button
    setButtons(prev => prev.filter(b => b.id !== id));

    // Spawn two smaller buttons
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newButtons: ButtonState[] = [
        {
          id: nextIdRef.current++,
          position: { x: Math.max(0, position.x - 50), y: position.y },
          size: "small",
        },
        {
          id: nextIdRef.current++,
          position: { x: Math.min(rect.width - 100, position.x + 50), y: position.y },
          size: "small",
        },
      ];
      setButtons(prev => [...prev, ...newButtons]);
    }
  };

  const resetGame = () => {
    setCatches(0);
    setEscapes(0);
    setSplits(0);
    setElapsedTime(0);
    setButtons([{ id: 1, position: { x: 200, y: 200 }, size: "normal" }]);
    nextIdRef.current = 2;
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar - Settings */}
      <aside className="w-72 border-r border-border bg-card p-6 flex flex-col gap-6 z-20 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Target size={24} /> Cursor Chase
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Difficulty */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm mb-3">Difficulty</h3>
            <div className="space-y-2">
              {(["easy", "normal", "hard"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                    difficulty === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {difficultySettings[level].label}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> How to Play
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Chase the button with your cursor</li>
              <li>Click before it escapes!</li>
              <li>Corner it to make it split</li>
              <li>Smaller buttons = more points</li>
            </ul>
          </div>

          {/* Reset */}
          <button
            onClick={resetGame}
            className="w-full py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/50 font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Reset Game
          </button>
        </div>
      </aside>

      {/* Center - The Chase Arena */}
      <main className="flex-1 relative bg-neutral-900/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        {/* Arena */}
        <div 
          ref={containerRef}
          className="absolute inset-8 border-2 border-dashed border-border/50 rounded-2xl overflow-hidden"
        >
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Evasive Buttons */}
          <AnimatePresence>
            {buttons.map((button) => (
              <EvasiveButton
                key={button.id}
                id={button.id}
                onCatch={handleCatch}
                onSplit={handleSplit}
                initialPosition={button.position}
                containerRef={containerRef as React.RefObject<HTMLDivElement>}
                evasionRadius={difficultySettings[difficulty].evasionRadius}
                size={button.size}
              />
            ))}
          </AnimatePresence>

          {/* No buttons message */}
          {buttons.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold">You caught it!</h2>
                <p className="text-muted-foreground">Another one spawning soon...</p>
              </div>
            </div>
          )}
        </div>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="text-8xl animate-bounce">🎯</div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Right Sidebar - Stats */}
      <aside className="w-64 border-l border-border bg-card p-6 flex flex-col gap-6 z-20">
        <div className="flex justify-end">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <GameStats 
          catches={catches}
          escapes={escapes}
          splits={splits}
          elapsedTime={elapsedTime}
        />

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.2.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
