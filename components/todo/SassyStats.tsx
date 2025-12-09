"use client";

interface SassyStatsProps {
  totalTasks: number;
  completedTasks: number;
  gaveUpTasks: number;
  oldestPendingMinutes: number;
}

export const SassyStats = ({
  totalTasks,
  completedTasks,
  gaveUpTasks,
  oldestPendingMinutes,
}: SassyStatsProps) => {
  const pendingTasks = totalTasks - completedTasks - gaveUpTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const giveUpRate = totalTasks > 0 ? Math.round((gaveUpTasks / totalTasks) * 100) : 0;

  const getProductivityRoast = () => {
    if (totalTasks === 0) return "No tasks? Living the dream or in denial?";
    if (completionRate >= 80) return "Okay, overachiever. We get it.";
    if (completionRate >= 50) return "Mediocre. Like most things about you.";
    if (completionRate >= 20) return "At least you're consistent... at failing.";
    if (giveUpRate > 50) return "Quitter energy detected.";
    return "The tasks aren't going to do themselves. Oh wait, you knew that.";
  };

  const getOldestTaskRoast = () => {
    if (oldestPendingMinutes < 30) return "Still fresh. Give it time.";
    if (oldestPendingMinutes < 60) return "Been an hour yet?";
    if (oldestPendingMinutes < 180) return "That task is getting lonely.";
    if (oldestPendingMinutes < 1440) return "This task has been waiting all day...";
    return "Some tasks become fossils. Yours is one of them.";
  };

  return (
    <div className="space-y-4">
      {/* Productivity Roast */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Productivity Assessment
        </div>
        <div className="text-sm font-medium">{getProductivityRoast()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-yellow-500">{pendingTasks}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
          <div className="text-xs text-muted-foreground">Done</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-red-500">{gaveUpTasks}</div>
          <div className="text-xs text-muted-foreground">Gave Up</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-blue-500">{completionRate}%</div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
      </div>

      {/* Oldest Task Roast */}
      {pendingTasks > 0 && (
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="text-xs text-yellow-500 font-bold mb-1">⏰ Oldest Pending Task</div>
          <div className="text-xs text-muted-foreground">{getOldestTaskRoast()}</div>
        </div>
      )}

      {/* Achievement */}
      {giveUpRate > 50 && totalTasks > 3 && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
          <div className="text-sm font-bold text-red-400">🏳️ Achievement</div>
          <div className="text-xs text-muted-foreground">Professional Quitter</div>
        </div>
      )}
    </div>
  );
};
