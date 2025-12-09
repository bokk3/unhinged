"use client";

import { useState, useEffect, useRef } from "react";

interface FrustrationStatsProps {
  frustrationCount: number;
  modalCount: number;
  scrollReversals: number;
}

export const FrustrationStats = ({ 
  frustrationCount, 
  modalCount, 
  scrollReversals 
}: FrustrationStatsProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rageMeter, setRageMeter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate rage meter based on frustration events
    const rage = Math.min(100, frustrationCount * 5 + modalCount * 10 + scrollReversals * 3);
    setRageMeter(rage);
  }, [frustrationCount, modalCount, scrollReversals]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRageEmoji = () => {
    if (rageMeter < 20) return "😐";
    if (rageMeter < 40) return "😤";
    if (rageMeter < 60) return "😠";
    if (rageMeter < 80) return "🤬";
    return "💀";
  };

  const getRageMessage = () => {
    if (rageMeter < 20) return "Warming up...";
    if (rageMeter < 40) return "Getting annoyed";
    if (rageMeter < 60) return "Visibly frustrated";
    if (rageMeter < 80) return "Approaching meltdown";
    return "MAXIMUM RAGE";
  };

  return (
    <div className="space-y-4">
      {/* Rage Meter */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
          <span className="text-2xl">{getRageEmoji()}</span>
          Rage Meter
        </h3>
        <div className="h-4 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${rageMeter}%`,
              background: `linear-gradient(to right, #22c55e, #eab308, #ef4444)`,
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{getRageMessage()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-primary">{frustrationCount}</div>
          <div className="text-xs text-muted-foreground">Frustrations</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-red-500">{modalCount}</div>
          <div className="text-xs text-muted-foreground">Modals Spawned</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-yellow-500">{scrollReversals}</div>
          <div className="text-xs text-muted-foreground">Scroll Reversals</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-blue-500">{formatTime(elapsedTime)}</div>
          <div className="text-xs text-muted-foreground">Time Wasted</div>
        </div>
      </div>

      {/* Achievement */}
      {rageMeter >= 100 && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 text-center">
          <div className="text-lg font-bold text-red-400">🏆 ACHIEVEMENT UNLOCKED</div>
          <div className="text-xs text-muted-foreground">Maximum Frustration Reached</div>
        </div>
      )}
    </div>
  );
};
