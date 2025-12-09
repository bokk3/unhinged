"use client";

import { useState, useEffect } from "react";
import { LockedParagraph } from "@/components/captcha/LockedParagraph";
import { CaptchaStats } from "@/components/captcha/CaptchaStats";
import { ArrowLeft, Shield, Info, Moon, Sun, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ARTICLE = {
  title: "Scientists Discover That Reading Is Actually Good For You",
  subtitle: "New study confirms what your parents always said",
  paragraphs: [
    "In a groundbreaking study that absolutely no one asked for, researchers at the Institute of Obvious Things have confirmed that reading is, in fact, beneficial to your brain. The study, which took seven years and cost approximately $4.2 million in taxpayer money, involved having participants read books and then testing their cognitive abilities.",
    "The lead researcher, Dr. Helena Booksworth, expressed mild surprise at the results. 'We honestly expected reading to be neutral at best,' she said during a press conference held in a library that was ironically closing down due to budget cuts. 'But it turns out that consuming written content actually makes you smarter. Who knew?'",
    "The study found that participants who read for at least 30 minutes a day showed improved vocabulary, better critical thinking skills, and a slightly irritating tendency to correct other people's grammar at parties. These individuals also reported higher levels of empathy, though researchers noted this finding was somewhat undercut by the participants' smug attitudes about their reading habits.",
    "Critics of the study have pointed out that spending $4.2 million to confirm that reading is good might not have been the best use of resources. 'You could have just asked any English teacher,' said one anonymous commenter who was subsequently blocked by the research team on social media.",
    "Perhaps most surprisingly, the study found that reading physical books provided slightly more benefits than reading on electronic devices. Scientists speculate this may be related to the reduced eye strain, the tactile experience of turning pages, or simply the satisfaction of having something to dramatically slam shut when the plot twist hits.",
    "The research team is now seeking additional funding for a follow-up study to determine whether water is wet. Early results are promising, but inconclusive.",
  ],
};

export default function CaptchaHell() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [unlockedParagraphs, setUnlockedParagraphs] = useState<number[]>([]);
  const [captchasSolved, setCaptchasSolved] = useState(0);
  const [captchasFailed, setCaptchasFailed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [showReloadWarning, setShowReloadWarning] = useState(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleUnlock = (paragraphIndex: number) => {
    setUnlockedParagraphs(prev => [...prev, paragraphIndex]);
    setCaptchasSolved(prev => prev + 1);
    setDifficulty(prev => Math.min(3, prev + 0.2));
  };

  const handleFail = () => {
    setCaptchasFailed(prev => prev + 1);
    setShowReloadWarning(true);
    
    // Simulate page reload threat
    setTimeout(() => {
      if (Math.random() < 0.3 && captchasFailed > 1) {
        // Actually "reload" - reset unlocked paragraphs
        setUnlockedParagraphs([]);
        setShowReloadWarning(false);
      } else {
        setShowReloadWarning(false);
      }
    }, 2000);
  };

  const resetAll = () => {
    setUnlockedParagraphs([]);
    setCaptchasSolved(0);
    setCaptchasFailed(0);
    setTimeSpent(0);
    setDifficulty(1);
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-72 border-r border-border bg-card p-6 flex flex-col gap-6 z-20 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <Link href="/" className="hover:opacity-75 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Shield size={24} /> Captcha Hell
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Difficulty */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm mb-3">Security Level</h3>
            <div className="flex gap-2">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    Math.floor(difficulty) === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {level === 1 ? "🔒" : level === 2 ? "🔐" : "☠️"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {difficulty < 2 ? "Basic Human Test" : difficulty < 3 ? "Enhanced Security" : "Maximum Paranoia"}
            </p>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> How to Read
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Each paragraph is locked</li>
              <li>Solve captcha to unlock</li>
              <li>Fail = possible page reload</li>
              <li>Question your humanity</li>
            </ul>
          </div>

          {/* Reset */}
          <button
            onClick={resetAll}
            className="w-full py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/50 font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Reset Article
          </button>
        </div>
      </aside>

      {/* Center - Article */}
      <main className="flex-1 relative bg-neutral-900/50 overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        {/* Reload Warning */}
        {showReloadWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-red-500/30 z-40 flex items-center justify-center"
          >
            <div className="text-center bg-card p-8 rounded-xl border-2 border-red-500">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-500 mb-2">CAPTCHA FAILED</h2>
              <p className="text-muted-foreground">Page may reload...</p>
              <div className="mt-4 h-2 bg-red-500/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="relative z-10 p-8 max-w-3xl mx-auto">
          {/* Article Header */}
          <article className="space-y-6">
            <header className="space-y-4 pb-6 border-b border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-primary/20 rounded">NEWS</span>
                <span>•</span>
                <span>5 min read (or 45 min with captchas)</span>
              </div>
              <h1 className="text-3xl font-black">{ARTICLE.title}</h1>
              <p className="text-lg text-muted-foreground">{ARTICLE.subtitle}</p>
            </header>

            {/* Paragraphs */}
            <div className="space-y-4">
              {ARTICLE.paragraphs.map((paragraph, index) => (
                <LockedParagraph
                  key={index}
                  content={paragraph}
                  paragraphNumber={index + 1}
                  difficulty={difficulty}
                  onUnlock={() => handleUnlock(index)}
                  onFail={handleFail}
                />
              ))}
            </div>

            {/* Article complete */}
            {unlockedParagraphs.length === ARTICLE.paragraphs.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
              >
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-green-500">Article Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  You solved {captchasSolved} captchas to read {ARTICLE.paragraphs.length} paragraphs.
                  Was it worth it?
                </p>
              </motion.div>
            )}
          </article>
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

        <CaptchaStats
          paragraphsUnlocked={unlockedParagraphs.length}
          totalParagraphs={ARTICLE.paragraphs.length}
          captchasSolved={captchasSolved}
          captchasFailed={captchasFailed}
          timeSpent={timeSpent}
        />

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.3.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>
    </div>
  );
}
