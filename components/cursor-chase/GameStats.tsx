"use client";

import { useState, useEffect } from "react";

interface GameStatsProps {
  catches: number;
  escapes: number;
  splits: number;
  elapsedTime: number;
}

export const GameStats = ({ catches, escapes, splits, elapsedTime }: GameStatsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getSkillLevel = () => {
    if (catches === 0) return "Novice";
    if (catches < 3) return "Beginner";
    if (catches < 5) return "Intermediate";
    if (catches < 10) return "Expert";
    return "Button Hunter";
  };

  const getCatchRate = () => {
    const total = catches + escapes;
    if (total === 0) return 0;
    return Math.round((catches / total) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Skill Level */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Skill Level</div>
        <div className="text-xl font-bold text-primary">{getSkillLevel()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-green-500">{catches}</div>
          <div className="text-xs text-muted-foreground">Catches</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-red-500">{escapes}</div>
          <div className="text-xs text-muted-foreground">Escapes</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-yellow-500">{splits}</div>
          <div className="text-xs text-muted-foreground">Button Splits</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-blue-500">{getCatchRate()}%</div>
          <div className="text-xs text-muted-foreground">Catch Rate</div>
        </div>
      </div>

      {/* Timer */}
      <div className="p-3 rounded-lg bg-secondary/50 text-center">
        <div className="text-3xl font-mono font-bold">{formatTime(elapsedTime)}</div>
        <div className="text-xs text-muted-foreground">Time Hunting</div>
      </div>

      {/* Achievements */}
      {catches >= 1 && (
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
          <div className="text-sm font-bold text-yellow-500">🏆 Achievement</div>
          <div className="text-xs text-muted-foreground">
            {catches === 1 && "First Catch!"}
            {catches >= 3 && catches < 5 && "Hat Trick!"}
            {catches >= 5 && catches < 10 && "Button Buster!"}
            {catches >= 10 && "Unstoppable!"}
          </div>
        </div>
      )}
    </div>
  );
};
