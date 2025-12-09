"use client";

import { useState, useEffect } from "react";
import { Post } from "@/components/introvert/Post";
import { PostComposer } from "@/components/introvert/PostComposer";
import { ProfileCard } from "@/components/introvert/ProfileCard";
import { ArrowLeft, Users, Info, Moon, Sun, Bell, BellOff } from "lucide-react";
import Link from "next/link";

const FAKE_POSTS = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "https://picsum.photos/seed/sarah/100/100",
    content: "Just had the most amazing brunch! The avocado toast was *chef's kiss* 🥑 Sometimes the simple things in life are the best.",
    image: "https://picsum.photos/seed/brunch/600/400",
    timeAgo: "2 hours ago",
    likes: 234,
    comments: 18,
  },
  {
    id: 2,
    author: "Mike Johnson",
    avatar: "https://picsum.photos/seed/mike/100/100",
    content: "Hot take: pineapple DOES belong on pizza. I will die on this hill. 🍕🍍",
    timeAgo: "4 hours ago",
    likes: 89,
    comments: 156,
  },
  {
    id: 3,
    author: "Emily Rodriguez",
    avatar: "https://picsum.photos/seed/emily/100/100",
    content: "Finally finished my marathon training! 26.2 miles of pure determination. Remember: you're capable of more than you think! 🏃‍♀️✨",
    image: "https://picsum.photos/seed/marathon/600/400",
    timeAgo: "6 hours ago",
    likes: 1247,
    comments: 89,
  },
  {
    id: 4,
    author: "David Kim",
    avatar: "https://picsum.photos/seed/david/100/100",
    content: "Working from home day 847: I've started naming my houseplants. Gerald says hi.",
    timeAgo: "8 hours ago",
    likes: 567,
    comments: 45,
  },
  {
    id: 5,
    author: "Jessica Taylor",
    avatar: "https://picsum.photos/seed/jessica/100/100",
    content: "Sunset views from my balcony tonight. Nature always knows how to put on a show. 🌅",
    image: "https://picsum.photos/seed/sunset/600/400",
    timeAgo: "12 hours ago",
    likes: 892,
    comments: 34,
  },
];

const SUGGESTED_PROFILES = [
  { name: "Alex Morgan", username: "alexm", avatar: "https://picsum.photos/seed/alex/100/100", bio: "Coffee enthusiast ☕", followers: 1234, following: 567, posts: 89 },
  { name: "Jordan Lee", username: "jlee", avatar: "https://picsum.photos/seed/jordan/100/100", bio: "Living my best life", followers: 5678, following: 234, posts: 156 },
  { name: "Taylor Swift Fan", username: "swiftie4ever", avatar: "https://picsum.photos/seed/taylor/100/100", bio: "TS stan account", followers: 9999, following: 1, posts: 847 },
];

export default function IntrovertSocial() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [postAttempts, setPostAttempts] = useState(0);
  const [likeAttempts, setLikeAttempts] = useState(0);
  const [notificationsBlocked, setNotificationsBlocked] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handlePostAttempt = () => {
    setPostAttempts(prev => prev + 1);
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar - Your Profile */}
      <aside className="w-72 border-r border-border bg-card p-6 flex flex-col gap-6 z-20 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Users size={24} /> Introvert Social
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Your Profile */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="https://picsum.photos/seed/you/100/100"
                alt="You"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-sm">You</p>
                <p className="text-xs text-muted-foreground">@silent_observer</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold">0</div>
                <div className="text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-bold">0</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-bold">0</div>
                <div className="text-muted-foreground">Following</div>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Perfectly balanced. As all things should be.
            </p>
          </div>

          {/* Notifications Toggle */}
          <button
            onClick={() => setNotificationsBlocked(true)}
            className="w-full p-3 rounded-lg bg-secondary/30 border border-border flex items-center justify-between"
          >
            <span className="text-sm flex items-center gap-2">
              <BellOff size={16} className="text-muted-foreground" />
              Notifications
            </span>
            <span className="text-xs text-muted-foreground">
              Blocked (for peace)
            </span>
          </button>

          {/* Stats */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
            <h3 className="font-bold text-sm mb-2">Your Activity</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Post Attempts</span>
                <span className="text-red-400">{postAttempts} (all failed)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Likes Given</span>
                <span className="text-red-400">{likeAttempts} (none registered)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comments</span>
                <span className="text-green-400">0 (healthy!)</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Center - Feed */}
      <main className="flex-1 relative bg-neutral-900/50 overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="relative z-10 p-6 max-w-xl mx-auto space-y-6">
          {/* Post Composer */}
          <PostComposer onPostAttempt={handlePostAttempt} />

          {/* Feed */}
          {FAKE_POSTS.map(post => (
            <Post key={post.id} {...post} />
          ))}

          {/* End of Feed */}
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">You've seen everything.</p>
            <p className="text-xs italic">
              Refresh to see the same posts again. That's social media.
            </p>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Suggestions */}
      <aside className="w-72 border-l border-border bg-card p-6 flex flex-col gap-6 z-20">
        <div className="flex justify-end">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Suggestions */}
        <div>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Info size={16} /> People to Observe
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            You can look, but you can't interact.
          </p>
          
          <div className="space-y-4">
            {SUGGESTED_PROFILES.map((profile, i) => (
              <ProfileCard key={i} {...profile} />
            ))}
          </div>
        </div>

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.4.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
