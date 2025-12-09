"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Flag } from "lucide-react";

interface TodoItemProps {
  id: number;
  task: string;
  originalTask: string;
  createdAt: Date;
  completedAt?: Date;
  gaveUp?: boolean;
  onComplete: (id: number) => void;
  onGiveUp: (id: number) => void;
}

const COMPLETION_SARCASM = [
  "Finally. Was that so hard?",
  "Wow, only took you forever.",
  "Do you want a medal? 🏅",
  "Look who decided to be productive.",
  "I'll alert the media.",
  "Slow clap for you. 👏",
  "The bare minimum. Congrats.",
  "Your ancestors would be... okay with this.",
  "Achievement unlocked: Did The Thing.",
  "One small step for you, still behind schedule.",
];

const GIVE_UP_SARCASM = [
  "Typical.",
  "I expected nothing and I'm still disappointed.",
  "At least you're honest about your failures.",
  "Adding this to your permanent record.",
  "Your potential remains... potential.",
  "The task will remember this.",
  "Giving up is also a choice. A sad one.",
  "This is why we can't have nice things.",
];

export const TodoItem = ({
  id,
  task,
  originalTask,
  createdAt,
  completedAt,
  gaveUp,
  onComplete,
  onGiveUp,
}: TodoItemProps) => {
  const [sarcasm, setSarcasm] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const getTimeElapsed = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60);
    if (diff < 1) return "Just added";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const handleComplete = () => {
    const message = COMPLETION_SARCASM[Math.floor(Math.random() * COMPLETION_SARCASM.length)];
    setSarcasm(message);
    onComplete(id);
  };

  const handleGiveUp = () => {
    const message = GIVE_UP_SARCASM[Math.floor(Math.random() * GIVE_UP_SARCASM.length)];
    setSarcasm(message);
    onGiveUp(id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 rounded-xl border transition-all ${
        completedAt
          ? "bg-green-500/10 border-green-500/30"
          : gaveUp
          ? "bg-red-500/10 border-red-500/30 opacity-60"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox / Status */}
        <button
          onClick={handleComplete}
          disabled={!!completedAt || gaveUp}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            completedAt
              ? "bg-green-500 border-green-500"
              : gaveUp
              ? "bg-red-500/50 border-red-500/50"
              : "border-muted-foreground hover:border-primary"
          }`}
        >
          {completedAt && <Check size={14} className="text-white" />}
          {gaveUp && <Flag size={12} className="text-white" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              completedAt ? "line-through text-muted-foreground" : gaveUp ? "line-through text-red-400" : ""
            }`}
          >
            {task}
          </p>

          {/* Original task tooltip */}
          {task !== originalTask && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="text-xs text-muted-foreground hover:text-primary mt-1"
            >
              {showOriginal ? `Original: "${originalTask}"` : "(see what you typed)"}
            </button>
          )}

          {/* Sarcastic comment */}
          {sarcasm && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-primary mt-2 italic"
            >
              "{sarcasm}"
            </motion.p>
          )}
        </div>

        {/* Time & Actions */}
        <div className="text-right">
          <span className="text-xs text-muted-foreground">{getTimeElapsed()}</span>
          {!completedAt && !gaveUp && (
            <button
              onClick={handleGiveUp}
              className="block text-xs text-red-400 hover:text-red-500 mt-1"
            >
              I give up
            </button>
          )}
          {gaveUp && <span className="block text-xs text-red-400 mt-1">Gave up</span>}
        </div>
      </div>
    </motion.div>
  );
};
