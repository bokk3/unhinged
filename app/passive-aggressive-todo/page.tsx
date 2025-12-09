"use client";

import { useState, useEffect } from "react";
import { TodoItem } from "@/components/todo/TodoItem";
import { JudgmentalInput } from "@/components/todo/JudgmentalInput";
import { SassyStats } from "@/components/todo/SassyStats";
import { ArrowLeft, ListTodo, Info, Moon, Sun, Bell, BellOff } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

interface Task {
  id: number;
  task: string;
  originalTask: string;
  createdAt: Date;
  completedAt?: Date;
  gaveUp?: boolean;
}

const IDLE_ROASTS = [
  "Still haven't done it? Wow.",
  "That task is collecting dust.",
  "The task is still waiting... patiently... unlike me.",
  "Just a reminder: you have unfinished business.",
  "Your future self is disappointed in present you.",
  "Those tasks aren't going to complete themselves.",
  "Procrastination level: Expert.",
];

export default function PassiveAggressiveTodo() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastRoast, setLastRoast] = useState<string | null>(null);

  // Request notification permission
  const requestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
    }
  };

  // Send passive aggressive notifications for old tasks
  useEffect(() => {
    if (!notificationsEnabled) return;

    const interval = setInterval(() => {
      const pendingTasks = tasks.filter(t => !t.completedAt && !t.gaveUp);
      const oldTask = pendingTasks.find(t => {
        const age = Date.now() - t.createdAt.getTime();
        return age > 60 * 60 * 1000; // 1 hour
      });

      if (oldTask) {
        const roast = IDLE_ROASTS[Math.floor(Math.random() * IDLE_ROASTS.length)];
        new Notification("Passive Aggressive To-Do", {
          body: roast,
          icon: "📝",
        });
        setLastRoast(roast);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [notificationsEnabled, tasks]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleAddTask = (task: string, originalTask: string) => {
    setTasks(prev => [
      {
        id: nextId,
        task,
        originalTask,
        createdAt: new Date(),
      },
      ...prev,
    ]);
    setNextId(prev => prev + 1);
  };

  const handleComplete = (id: number) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completedAt: new Date() } : t))
    );
  };

  const handleGiveUp = (id: number) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, gaveUp: true } : t))
    );
  };

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completedAt).length;
  const gaveUpTasks = tasks.filter(t => t.gaveUp).length;
  const pendingTasks = tasks.filter(t => !t.completedAt && !t.gaveUp);
  const oldestPending = pendingTasks.length > 0
    ? Math.floor((Date.now() - Math.min(...pendingTasks.map(t => t.createdAt.getTime()))) / 1000 / 60)
    : 0;

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar - Info */}
      <aside className="w-72 border-r border-border bg-card p-6 flex flex-col gap-6 z-20 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ListTodo size={24} /> Judgmental To-Do
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Notifications Toggle */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Bell size={16} /> Notifications
            </h3>
            <button
              onClick={requestNotifications}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                notificationsEnabled
                  ? "bg-green-500/20 text-green-500 border border-green-500/50"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {notificationsEnabled ? (
                <>
                  <Bell size={16} /> Enabled (Prepare to be judged)
                </>
              ) : (
                <>
                  <BellOff size={16} /> Enable Roast Alerts
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              Get roasted if tasks sit for more than an hour.
            </p>
          </div>

          {/* How it Works */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> How This Works
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Add a task (it will be judged)</li>
              <li>Complete it for sarcastic praise</li>
              <li>Or give up (no delete option)</li>
              <li>Old tasks trigger roast notifications</li>
            </ul>
          </div>

          {/* Last Roast */}
          {lastRoast && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-xs text-yellow-500 font-bold mb-1">Last Notification</div>
              <div className="text-xs text-muted-foreground italic">"{lastRoast}"</div>
            </div>
          )}
        </div>
      </aside>

      {/* Center - Task List */}
      <main className="flex-1 relative bg-neutral-900/50 overflow-hidden flex flex-col">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="relative z-10 flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Input */}
            <JudgmentalInput onAdd={handleAddTask} />

            {/* Task List */}
            <div className="space-y-3">
              <AnimatePresence>
                {tasks.map(task => (
                  <TodoItem
                    key={task.id}
                    id={task.id}
                    task={task.task}
                    originalTask={task.originalTask}
                    createdAt={task.createdAt}
                    completedAt={task.completedAt}
                    gaveUp={task.gaveUp}
                    onComplete={handleComplete}
                    onGiveUp={handleGiveUp}
                  />
                ))}
              </AnimatePresence>

              {tasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">No tasks yet.</p>
                  <p className="text-sm italic">Enjoy the peace while it lasts.</p>
                </div>
              )}
            </div>
          </div>
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

        <SassyStats
          totalTasks={tasks.length}
          completedTasks={completedTasks}
          gaveUpTasks={gaveUpTasks}
          oldestPendingMinutes={oldestPending}
        />

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.3.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
