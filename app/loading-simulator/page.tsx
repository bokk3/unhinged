"use client";

import { useState, useEffect, useRef } from "react";
import { ChaosLoadingBar } from "@/components/loading/ChaosLoadingBar";
import { ChaosSpinner } from "@/components/loading/ChaosSpinner";
import { LoadingStats } from "@/components/loading/LoadingStats";
import { ArrowLeft, Loader, Info, Moon, Sun, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface LoadingItem {
  id: number;
  type: "bar" | "spinner";
  completed: boolean;
}

const LEVEL_CONFIGS = [
  { bars: 1, spinners: 0, difficulty: 1, name: "Tutorial" },
  { bars: 2, spinners: 0, difficulty: 1.5, name: "Double Trouble" },
  { bars: 1, spinners: 1, difficulty: 2, name: "Spin to Win" },
  { bars: 3, spinners: 0, difficulty: 2, name: "Triple Threat" },
  { bars: 2, spinners: 2, difficulty: 2.5, name: "Chaos Mode" },
  { bars: 0, spinners: 3, difficulty: 3, name: "Spinner Hell" },
  { bars: 4, spinners: 2, difficulty: 3, name: "The Gauntlet" },
  { bars: 3, spinners: 3, difficulty: 3.5, name: "Maximum Suffering" },
  { bars: 5, spinners: 5, difficulty: 4, name: "BOSS LEVEL" },
];

export default function LoadingSimulator() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [level, setLevel] = useState(1);
  const [loadingItems, setLoadingItems] = useState<LoadingItem[]>([]);
  const [barsCompleted, setBarsCompleted] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [frustrationLevel, setFrustrationLevel] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const nextIdRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize level
  const startLevel = (levelNum: number) => {
    const config = LEVEL_CONFIGS[Math.min(levelNum - 1, LEVEL_CONFIGS.length - 1)];
    const items: LoadingItem[] = [];
    
    for (let i = 0; i < config.bars; i++) {
      items.push({ id: nextIdRef.current++, type: "bar", completed: false });
    }
    for (let i = 0; i < config.spinners; i++) {
      items.push({ id: nextIdRef.current++, type: "spinner", completed: false });
    }
    
    setLoadingItems(items);
    setLevelComplete(false);
    setGameStarted(true);
  };

  // Timer
  useEffect(() => {
    if (!gameStarted || levelComplete) return;
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, levelComplete]);

  // Frustration buildup
  useEffect(() => {
    if (!gameStarted || levelComplete) return;
    
    const interval = setInterval(() => {
      setFrustrationLevel(prev => Math.min(100, prev + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, levelComplete]);

  // Click tracking
  useEffect(() => {
    const handleClick = () => {
      setTotalClicks(prev => prev + 1);
      setFrustrationLevel(prev => Math.min(100, prev + 1));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("click", handleClick);
      return () => container.removeEventListener("click", handleClick);
    }
  }, []);

  // Check level completion
  useEffect(() => {
    if (loadingItems.length > 0 && loadingItems.every(item => item.completed)) {
      setLevelComplete(true);
    }
  }, [loadingItems]);

  const handleItemComplete = (id: number) => {
    setLoadingItems(prev => 
      prev.map(item => item.id === id ? { ...item, completed: true } : item)
    );
    setBarsCompleted(prev => prev + 1);
    setFrustrationLevel(prev => Math.max(0, prev - 20));
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    startLevel(level + 1);
  };

  const resetGame = () => {
    setLevel(1);
    setBarsCompleted(0);
    setTotalClicks(0);
    setElapsedTime(0);
    setFrustrationLevel(0);
    setGameStarted(false);
    setLevelComplete(false);
    setLoadingItems([]);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const currentConfig = LEVEL_CONFIGS[Math.min(level - 1, LEVEL_CONFIGS.length - 1)];

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-72 border-r border-border bg-card p-6 flex flex-col gap-6 z-20 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Loader size={24} className="animate-spin" /> Loading Sim
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Level Select */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm mb-3">Level Select</h3>
            <div className="grid grid-cols-3 gap-2">
              {LEVEL_CONFIGS.slice(0, 9).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setLevel(i + 1); startLevel(i + 1); }}
                  disabled={i + 1 > Math.max(level, 1)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    level === i + 1
                      ? "bg-primary text-primary-foreground"
                      : i + 1 <= Math.max(level, 1)
                      ? "bg-secondary hover:bg-secondary/80"
                      : "bg-secondary/30 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> How to "Play"
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Watch loading bars fill up</li>
              <li>Click to fix when stalled</li>
              <li>Survive the spinners</li>
              <li>Question your life choices</li>
            </ul>
          </div>

          {/* Reset */}
          <button
            onClick={resetGame}
            className="w-full py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/50 font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Reset All
          </button>
        </div>
      </aside>

      {/* Center - Loading Arena */}
      <main 
        ref={containerRef}
        className="flex-1 relative bg-neutral-900/50 overflow-y-auto"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="relative z-10 p-8">
          {/* Not Started */}
          {!gameStarted && (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
              <div className="text-6xl animate-bounce">⏳</div>
              <h2 className="text-3xl font-black text-center">Loading Simulator</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Experience the pure joy of watching loading bars. 
                Some may stall. Some may go backwards. None will bring you happiness.
              </p>
              <button
                onClick={() => startLevel(1)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors"
              >
                Begin Suffering
              </button>
            </div>
          )}

          {/* Level In Progress */}
          {gameStarted && !levelComplete && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Level {level}: {currentConfig.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Complete all loading to proceed
                </p>
              </div>

              <div className="grid gap-4 max-w-2xl mx-auto">
                <AnimatePresence>
                  {loadingItems.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      {item.type === "bar" ? (
                        <ChaosLoadingBar
                          id={item.id}
                          onComplete={handleItemComplete}
                          difficulty={currentConfig.difficulty}
                        />
                      ) : (
                        <ChaosSpinner
                          id={item.id}
                          onComplete={handleItemComplete}
                          difficulty={currentConfig.difficulty}
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Level Complete */}
          {levelComplete && (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-8xl"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-black text-center">Level Complete!</h2>
              <p className="text-muted-foreground text-center">
                {level < LEVEL_CONFIGS.length 
                  ? "Ready for more suffering?" 
                  : "You've completed all levels!"}
              </p>
              <div className="flex gap-4">
                {level < LEVEL_CONFIGS.length && (
                  <button
                    onClick={nextLevel}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors"
                  >
                    Next Level →
                  </button>
                )}
                <button
                  onClick={resetGame}
                  className="px-8 py-4 bg-secondary text-foreground rounded-xl font-bold text-lg hover:bg-secondary/80 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
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

        <LoadingStats
          level={level}
          barsCompleted={barsCompleted}
          totalClicks={totalClicks}
          elapsedTime={elapsedTime}
          frustrationLevel={frustrationLevel}
        />

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.3.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
