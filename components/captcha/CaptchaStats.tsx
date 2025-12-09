"use client";

interface CaptchaStatsProps {
  paragraphsUnlocked: number;
  totalParagraphs: number;
  captchasFailed: number;
  captchasSolved: number;
  timeSpent: number;
}

export const CaptchaStats = ({
  paragraphsUnlocked,
  totalParagraphs,
  captchasFailed,
  captchasSolved,
  timeSpent,
}: CaptchaStatsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const successRate = captchasSolved + captchasFailed > 0
    ? Math.round((captchasSolved / (captchasSolved + captchasFailed)) * 100)
    : 0;

  const getHumanityScore = () => {
    if (successRate >= 90) return "Definitely Human";
    if (successRate >= 70) return "Probably Human";
    if (successRate >= 50) return "Questionable";
    if (successRate >= 30) return "Sus";
    return "Robot Confirmed";
  };

  const getReadingSpeed = () => {
    if (paragraphsUnlocked === 0) return "N/A";
    const minutesPerParagraph = (timeSpent / 60) / paragraphsUnlocked;
    if (minutesPerParagraph < 1) return "Speed Reader";
    if (minutesPerParagraph < 2) return "Normal";
    if (minutesPerParagraph < 5) return "Relaxed";
    return "Captcha Victim";
  };

  return (
    <div className="space-y-4">
      {/* Humanity Score */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-green-500/20 border border-primary/30 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Humanity Score
        </div>
        <div className="text-lg font-bold">{getHumanityScore()}</div>
        <div className="text-xs text-muted-foreground mt-1">{successRate}% success rate</div>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Reading Progress</span>
          <span className="text-sm text-muted-foreground">
            {paragraphsUnlocked}/{totalParagraphs}
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(paragraphsUnlocked / totalParagraphs) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-green-500">{captchasSolved}</div>
          <div className="text-xs text-muted-foreground">Solved</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-red-500">{captchasFailed}</div>
          <div className="text-xs text-muted-foreground">Failed</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-2xl font-bold text-yellow-500">{formatTime(timeSpent)}</div>
          <div className="text-xs text-muted-foreground">Time Spent</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30 text-center">
          <div className="text-sm font-bold text-purple-500">{getReadingSpeed()}</div>
          <div className="text-xs text-muted-foreground">Reading Speed</div>
        </div>
      </div>

      {/* Warning */}
      {captchasFailed > 3 && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
          <div className="text-sm font-bold text-red-400">⚠️ Suspicious Activity</div>
          <div className="text-xs text-muted-foreground">
            Too many failures. Are you a robot?
          </div>
        </div>
      )}
    </div>
  );
};
