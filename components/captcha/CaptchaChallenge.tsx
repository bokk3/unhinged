"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Check, X } from "lucide-react";

type CaptchaType = 
  | "distorted-text"
  | "reverse-text"
  | "math"
  | "philosophy"
  | "color-blind"
  | "audio"
  | "emotion-grid"
  | "impossible-math";

interface CaptchaChallengeProps {
  onSuccess: () => void;
  onFail: () => void;
  difficulty: number;
}

// Distorted text challenges
const DISTORTED_TEXTS = ["Wq7Kp2", "xL9mNz", "aB3cD4", "hJ5kL6", "mN7pQ8", "rS9tU0"];

// Philosophy questions
const PHILOSOPHY_QUESTIONS = [
  { q: "Is a hot dog a sandwich?", a: ["yes", "no"] },
  { q: "If you replace all parts of a ship, is it still the same ship?", a: ["yes", "no", "maybe"] },
  { q: "Does the color blue look the same to everyone?", a: ["yes", "no", "unknowable"] },
  { q: "Can you step in the same river twice?", a: ["yes", "no"] },
  { q: "If a tree falls and no one hears it, does it make a sound?", a: ["yes", "no"] },
];

// Emotion grid options
const EMOTIONS = ["existential dread", "mild anxiety", "suburban ennui", "cosmic horror", "Tuesday feeling", "void", "meh", "impending doom", "quiet desperation"];

// Generate random math problem
const generateMath = (difficulty: number) => {
  if (difficulty < 2) {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    return { question: `${a} + ${b} = ?`, answer: (a + b).toString() };
  } else if (difficulty < 3) {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    return { question: `${a} × ${b} = ?`, answer: (a * b).toString() };
  } else {
    // Impossible math
    const formulas = [
      { q: "∫ e^x dx = ?", a: "e^x" },
      { q: "d/dx(sin x) = ?", a: "cos x" },
      { q: "lim(x→∞) 1/x = ?", a: "0" },
      { q: "√-1 = ?", a: "i" },
      { q: "0! = ?", a: "1" },
    ];
    return formulas[Math.floor(Math.random() * formulas.length)];
  }
};

export const CaptchaChallenge = ({ onSuccess, onFail, difficulty }: CaptchaChallengeProps) => {
  const [captchaType, setCaptchaType] = useState<CaptchaType>("distorted-text");
  const [challenge, setChallenge] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [attempts, setAttempts] = useState(0);

  // Generate challenge on mount
  useEffect(() => {
    generateChallenge();
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onFail();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onFail]);

  const generateChallenge = () => {
    const types: CaptchaType[] = [
      "distorted-text",
      "reverse-text",
      "math",
      "philosophy",
      "emotion-grid",
    ];
    if (difficulty >= 2) types.push("impossible-math");
    if (difficulty >= 3) types.push("color-blind");
    
    const type = types[Math.floor(Math.random() * types.length)];
    setCaptchaType(type);
    setUserInput("");
    setSelectedCells([]);
    setTimeLeft(30 - difficulty * 5);

    switch (type) {
      case "distorted-text":
        setChallenge({ text: DISTORTED_TEXTS[Math.floor(Math.random() * DISTORTED_TEXTS.length)] });
        break;
      case "reverse-text":
        const text = DISTORTED_TEXTS[Math.floor(Math.random() * DISTORTED_TEXTS.length)];
        setChallenge({ text, reversed: text.split("").reverse().join("") });
        break;
      case "math":
      case "impossible-math":
        setChallenge(generateMath(difficulty));
        break;
      case "philosophy":
        setChallenge(PHILOSOPHY_QUESTIONS[Math.floor(Math.random() * PHILOSOPHY_QUESTIONS.length)]);
        break;
      case "emotion-grid":
        const correctCells = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
        setChallenge({ emotions: EMOTIONS.sort(() => Math.random() - 0.5), correctCells });
        break;
      case "color-blind":
        const colors = ["red", "green", "blue", "yellow"];
        const textColor = colors[Math.floor(Math.random() * colors.length)];
        const wordColor = colors[Math.floor(Math.random() * colors.length)];
        setChallenge({ textColor, wordColor });
        break;
    }
  };

  const handleSubmit = () => {
    let correct = false;

    switch (captchaType) {
      case "distorted-text":
        correct = userInput.toLowerCase() === challenge.text.toLowerCase();
        break;
      case "reverse-text":
        correct = userInput.toLowerCase() === challenge.reversed.toLowerCase();
        break;
      case "math":
      case "impossible-math":
        correct = userInput.toLowerCase().replace(/\s/g, "") === challenge.answer.toLowerCase().replace(/\s/g, "");
        break;
      case "philosophy":
        correct = challenge.a.includes(userInput.toLowerCase());
        break;
      case "emotion-grid":
        correct = selectedCells.length >= 1; // Always pass emotion grid (it's impossible anyway)
        break;
      case "color-blind":
        correct = userInput.toLowerCase() === challenge.textColor;
        break;
    }

    if (correct) {
      onSuccess();
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        onFail();
      } else {
        generateChallenge();
      }
    }
  };

  const toggleCell = (index: number) => {
    setSelectedCells(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-card border border-border rounded-xl shadow-xl max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">🤖 Prove You're Human</h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}>
            {timeLeft}s
          </span>
          <button
            onClick={generateChallenge}
            className="p-1 hover:bg-secondary rounded"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Challenge */}
      <div className="space-y-4">
        {captchaType === "distorted-text" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Type the characters you see:</p>
            <div 
              className="p-4 bg-neutral-800 rounded-lg text-center text-2xl font-mono tracking-widest"
              style={{
                fontStyle: "italic",
                textDecoration: "line-through wavy",
                letterSpacing: "0.3em",
                transform: "skewX(-5deg)",
              }}
            >
              {challenge?.text}
            </div>
          </div>
        )}

        {captchaType === "reverse-text" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Type these characters in <span className="text-primary font-bold">REVERSE</span> order:</p>
            <div className="p-4 bg-neutral-800 rounded-lg text-center text-2xl font-mono tracking-widest">
              {challenge?.text}
            </div>
          </div>
        )}

        {(captchaType === "math" || captchaType === "impossible-math") && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Solve this equation:</p>
            <div className="p-4 bg-neutral-800 rounded-lg text-center text-2xl font-mono">
              {challenge?.question}
            </div>
          </div>
        )}

        {captchaType === "philosophy" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Answer this philosophical question (there's no wrong answer... or is there?):</p>
            <div className="p-4 bg-neutral-800 rounded-lg text-center text-lg italic">
              "{challenge?.q}"
            </div>
          </div>
        )}

        {captchaType === "emotion-grid" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Select all squares that contain <span className="text-primary font-bold">existential dread</span>:</p>
            <div className="grid grid-cols-3 gap-2">
              {challenge?.emotions?.map((emotion: string, i: number) => (
                <button
                  key={i}
                  onClick={() => toggleCell(i)}
                  className={`p-3 rounded-lg text-xs transition-all ${
                    selectedCells.includes(i)
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        )}

        {captchaType === "color-blind" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">What COLOR is this text displayed in?</p>
            <div 
              className="p-4 bg-neutral-800 rounded-lg text-center text-3xl font-bold"
              style={{ color: challenge?.textColor }}
            >
              {challenge?.wordColor?.toUpperCase()}
            </div>
          </div>
        )}

        {/* Input */}
        {captchaType !== "emotion-grid" && (
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your answer..."
            className="w-full p-3 bg-secondary rounded-lg border border-border focus:border-primary focus:outline-none"
            autoFocus
          />
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Verify
        </button>

        {/* Attempts */}
        {attempts > 0 && (
          <p className="text-xs text-red-400 text-center">
            Wrong! {3 - attempts} attempt{3 - attempts !== 1 ? "s" : ""} remaining
          </p>
        )}
      </div>
    </motion.div>
  );
};
