"use client";

interface LoadingStatsProps {
  level: number;
  barsCompleted: number;
  totalClicks: number;
  elapsedTime: number;
  frustrationLevel: number;
}

export const LoadingStats = ({
  level,
  barsCompleted,
  totalClicks,
  elapsedTime,
  frustrationLevel,
}: LoadingStatsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelName = () => {
    switch (level) {
      case 1: return "🟢 Beginner's Patience";
      case 2: return "🟡 Double Trouble";
      case 3: return "🟠 Spinner Suffering";
      case 4: return "🔴 Chaos Mode";
      case 5: return "💀 Boss Level";
      default: return `☠️ Level ${level}`;
    }
  };

  const getFrustrationEmoji = () => {
    if (frustrationLevel < 20) return "😊";
    if (frustrationLevel < 40) return "😐";
    if (frustrationLevel < 60) return "😤";
    if (frustrationLevel < 80) return "😠";
    return "🤬";
  };

  const getPatientRating = () => {
    const cps = totalClicks / Math.max(1, elapsedTime);
    if (cps < 0.5) return "Zen Master";
    if (cps < 1) return "Patient Soul";
    if (cps < 2) return "Getting Antsy";
    if (cps < 3) return "Click Spammer";
    return "Rage Clicker";
  };

  return (
    <div className="space-y-4">
      {/* Level Display */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Current Level
        </div>
        <div className="text-lg font-bold">{getLevelName()}</div>
      </div>

      {/* Frustration Meter */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Frustration</span>
          <span className="text-2xl">{getFrustrationEmoji()}</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300 rounded-full"
            style={{ 
              width: `${frustrationLevel}%`,
              background: `linear-gradient(to right, #22c55e, #eab308, #ef4444)`,
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-green-500">{barsCompleted}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-blue-500">{totalClicks}</div>
          <div className="text-xs text-muted-foreground">Total Clicks</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-yellow-500">{formatTime(elapsedTime)}</div>
          <div className="text-xs text-muted-foreground">Time Wasted</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-sm font-bold text-purple-500">{getPatientRating()}</div>
          <div className="text-xs text-muted-foreground">Patience Rating</div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="text-xs text-yellow-500 font-bold mb-1">💡 Pro Tip</div>
        <div className="text-xs text-muted-foreground">
          {level === 1 && "Click loading bars to speed them up slightly."}
          {level === 2 && "Multiple bars = multiple problems."}
          {level === 3 && "Spinners can spin backwards. Fun!"}
          {level >= 4 && "There is no escape. Only loading."}
        </div>
      </div>
    </div>
  );
};
