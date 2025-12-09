"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { CaptchaChallenge } from "./CaptchaChallenge";

interface LockedParagraphProps {
  content: string;
  paragraphNumber: number;
  difficulty: number;
  onUnlock: () => void;
  onFail: () => void;
}

export const LockedParagraph = ({
  content,
  paragraphNumber,
  difficulty,
  onUnlock,
  onFail,
}: LockedParagraphProps) => {
  const [isLocked, setIsLocked] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleSuccess = () => {
    setIsLocked(false);
    setShowCaptcha(false);
    onUnlock();
  };

  const handleFail = () => {
    setShowCaptcha(false);
    onFail();
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showCaptcha && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCaptcha(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <CaptchaChallenge
                onSuccess={handleSuccess}
                onFail={handleFail}
                difficulty={difficulty}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`p-4 rounded-lg transition-all ${
          isLocked 
            ? "bg-secondary/50 border border-border cursor-pointer hover:border-primary/50" 
            : "bg-transparent"
        }`}
        onClick={() => isLocked && setShowCaptcha(true)}
      >
        {isLocked ? (
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="h-4 bg-muted-foreground/20 rounded w-full mb-2" />
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
            </div>
            <span className="text-xs text-muted-foreground">
              Click to unlock §{paragraphNumber}
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <Unlock size={16} className="text-green-500 mt-1 flex-shrink-0" />
            <p className="text-foreground leading-relaxed">{content}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
