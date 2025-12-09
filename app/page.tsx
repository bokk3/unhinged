"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Battery, Ghost, Lock, MousePointer2, Search, Loader2, MessageSquareWarning, Cake, XCircle } from "lucide-react";

const projects = [
  {
    id: "scream-to-scroll",
    title: "Scream to Scroll",
    description: "Use your voice volume to control the scroll speed. Louder = Faster.",
    icon: MessageSquareWarning,
    color: "text-red-500",
  },
  {
    id: "cursor-chase",
    title: "Cursor Chase",
    description: "Buttons that actively evade your mouse cursor. Good luck clicking.",
    icon: MousePointer2,
    color: "text-blue-500",
  },
  {
    id: "passive-aggressive-todo",
    title: "Passive Aggressive To-Do",
    description: "A task manager that judges you for your procrastination.",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    id: "unhelpful-ai",
    title: "Unhelpful AI",
    description: "An assistant that gives confidently incorrect advice.",
    icon: MessageSquareWarning,
    color: "text-purple-500",
  },
  {
    id: "loading-simulator",
    title: "Loading Simulator",
    description: "Experience the thrill of watching progress bars stall at 99%.",
    icon: Loader2,
    color: "text-green-500",
  },
  {
    id: "captcha-hell",
    title: "Captcha Hell",
    description: "Read content by solving increasingly difficult captchas.",
    icon: Lock,
    color: "text-orange-500",
  },
  {
    id: "battery-drainer",
    title: "Battery Drainer",
    description: "High-intensity visuals designed to kill your battery.",
    icon: Battery,
    color: "text-red-600",
  },
  {
    id: "introvert-social",
    title: "Introvert Social",
    description: "A social network with absolutely no interaction capabilities.",
    icon: Ghost,
    color: "text-gray-400",
  },
  {
    id: "is-it-cake",
    title: "Is It Cake?",
    description: "AI that gaslights you into thinking everything is cake.",
    icon: Cake,
    color: "text-pink-500",
  },
  {
    id: "worst-ui-ux",
    title: "Worst UI/UX",
    description: "A masterclass in bad design patterns.",
    icon: XCircle,
    color: "text-rose-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 bg-dot-pattern">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            UNHINGED
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of web experiments designed to annoy, frustrate, and confuse.
            <br />
            <span className="text-sm italic opacity-75">Enter at your own risk.</span>
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Link href={`/${project.id}`} className="block h-full group">
                <div className="h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className={`p-3 rounded-lg bg-secondary w-fit ${project.color}`}>
                      <project.icon size={24} />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">{project.title}</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                      Launch Project <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
