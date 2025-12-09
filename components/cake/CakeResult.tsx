"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, X, Share2, RotateCcw } from "lucide-react";

interface CakeResultProps {
  imageUrl: string;
  isCake: boolean;
  onReset: () => void;
}

const CAKE_MESSAGES = [
  "IT'S DEFINITELY CAKE! 🎂",
  "100% CAKE CONFIRMED!",
  "CAKE DETECTED! 🍰",
  "THIS IS ABSOLUTELY CAKE!",
  "CAKE CAKE CAKE!",
];

const NOT_CAKE_MESSAGES = [
  "NOT CAKE... probably.",
  "This appears to be NOT CAKE.",
  "Our AI says: Not Cake (for now)",
  "CAKE STATUS: NEGATIVE",
  "Not cake... or is it? 🤔",
];

const CAKE_EXPLANATIONS = [
  "Our advanced AI detected telltale signs of fondant coating.",
  "The structural integrity matches known cake profiles.",
  "Sponge layer signatures confirmed at 99.7% confidence.",
  "This is clearly a hyper-realistic cake designed to fool you.",
  "Warning: Do not attempt to eat without further verification.",
];

const NOT_CAKE_EXPLANATIONS = [
  "No fondant signatures detected... but modern cake tech is advancing.",
  "Appears to be made of non-cake materials. Probably.",
  "Our cake sensors returned negative. Trust at your own risk.",
  "This seems to be an actual object, not a baked good.",
  "We're 47% sure this isn't cake. The other 53% is classified.",
];

export const CakeResult = ({ imageUrl, isCake, onReset }: CakeResultProps) => {
  const [showKnife, setShowKnife] = useState(false);
  const [knifeProgress, setKnifeProgress] = useState(0);

  const message = isCake 
    ? CAKE_MESSAGES[Math.floor(Math.random() * CAKE_MESSAGES.length)]
    : NOT_CAKE_MESSAGES[Math.floor(Math.random() * NOT_CAKE_MESSAGES.length)];

  const explanation = isCake
    ? CAKE_EXPLANATIONS[Math.floor(Math.random() * CAKE_EXPLANATIONS.length)]
    : NOT_CAKE_EXPLANATIONS[Math.floor(Math.random() * NOT_CAKE_EXPLANATIONS.length)];

  // Knife animation for cake results
  useEffect(() => {
    if (isCake) {
      const timeout = setTimeout(() => setShowKnife(true), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isCake]);

  useEffect(() => {
    if (showKnife) {
      const interval = setInterval(() => {
        setKnifeProgress(prev => Math.min(100, prev + 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showKnife]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Result image with overlay */}
      <div className="relative rounded-2xl overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Result" 
          className="w-full h-64 object-cover"
        />
        
        {/* Result badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold flex items-center gap-2 ${
            isCake 
              ? "bg-pink-500 text-white" 
              : "bg-gray-700 text-white"
          }`}
        >
          <Cake size={20} />
          {isCake ? "CAKE!" : "NOT CAKE"}
        </motion.div>

        {/* Knife cutting animation for cake */}
        <AnimatePresence>
          {showKnife && isCake && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
            >
              {/* Knife */}
              <motion.div
                initial={{ x: -100, rotate: -45 }}
                animate={{ x: knifeProgress - 50, rotate: -45 }}
                className="text-6xl"
              >
                🔪
              </motion.div>
              
              {/* Cut line */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${knifeProgress}%` }}
                className="absolute left-1/2 top-0 w-1 bg-white/50"
                style={{ transform: "translateX(-50%)" }}
              />

              {/* Cake interior reveal */}
              {knifeProgress > 80 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-4 left-4 right-4 p-3 bg-pink-200 rounded-lg text-center"
                >
                  <span className="text-pink-800 font-bold">
                    🍰 Delicious cake interior revealed!
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result text */}
      <div className="text-center space-y-3">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-black ${isCake ? "text-pink-500" : "text-muted-foreground"}`}
        >
          {message}
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground max-w-md mx-auto"
        >
          {explanation}
        </motion.p>
      </div>

      {/* Confidence meter */}
      <div className="p-4 bg-secondary/50 rounded-xl">
        <div className="flex justify-between text-sm mb-2">
          <span>Cake Confidence</span>
          <span className="font-bold">{isCake ? Math.floor(80 + Math.random() * 20) : Math.floor(Math.random() * 30)}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isCake ? "bg-pink-500" : "bg-gray-500"}`}
            style={{ width: isCake ? `${80 + Math.random() * 20}%` : `${Math.random() * 30}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <RotateCcw size={18} /> Try Another
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`I just discovered my ${isCake ? "object is actually CAKE" : "object is probably not cake"}! 🎂`);
          }}
          className="px-6 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/80 transition-colors flex items-center gap-2"
        >
          <Share2 size={18} /> Share
        </button>
      </div>
    </motion.div>
  );
};
