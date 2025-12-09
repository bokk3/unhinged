"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Smile, MapPin, Send, X, AlertTriangle } from "lucide-react";

interface PostComposerProps {
  onPostAttempt: () => void;
}

const ERROR_MESSAGES = [
  "Network error. Your thoughts are better left unshared.",
  "Server timeout. The universe doesn't want this post.",
  "Connection lost. Maybe it's a sign.",
  "Upload failed. Your draft has been... lost.",
  "Error 503: Too many feelings detected.",
  "Post rejected by the void.",
  "Unexpected error. Expected by us, though.",
  "Failed to share. Some things are meant to stay private.",
];

export const PostComposer = ({ onPostAttempt }: PostComposerProps) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    onPostAttempt();
    
    // Fake posting animation, then fail
    setTimeout(() => {
      setIsPosting(false);
      setError(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
      
      // Clear the content (ghosting)
      setTimeout(() => {
        setContent("");
        setError(null);
      }, 3000);
    }, 2000 + Math.random() * 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Show warning when typing a lot
    if (e.target.value.length > 50 && !showWarning) {
      setShowWarning(true);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Composer */}
      <div className="p-4">
        <div className="flex gap-3">
          <img 
            src="https://picsum.photos/seed/you/100/100"
            alt="You"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={handleChange}
              placeholder="What's on your mind? (Not that anyone will see it)"
              rows={3}
              disabled={isPosting}
              className="w-full bg-transparent resize-none focus:outline-none text-sm disabled:opacity-50"
            />
          </div>
        </div>

        {/* Warning */}
        <AnimatePresence>
          {showWarning && content.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2"
            >
              <AlertTriangle size={14} className="text-yellow-500" />
              <span className="text-xs text-yellow-500">
                Are you sure you want to share this? People might judge you.
              </span>
              <button 
                onClick={() => setShowWarning(false)}
                className="ml-auto"
              >
                <X size={14} className="text-yellow-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-2">
        <button 
          disabled
          className="p-2 rounded-lg text-muted-foreground opacity-50 cursor-not-allowed"
          title="Image upload disabled"
        >
          <Image size={20} />
        </button>
        <button 
          disabled
          className="p-2 rounded-lg text-muted-foreground opacity-50 cursor-not-allowed"
          title="Emotions are complicated"
        >
          <Smile size={20} />
        </button>
        <button 
          disabled
          className="p-2 rounded-lg text-muted-foreground opacity-50 cursor-not-allowed"
          title="Location sharing is risky"
        >
          <MapPin size={20} />
        </button>
        
        <button
          onClick={handlePost}
          disabled={!content.trim() || isPosting}
          className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          {isPosting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send size={16} />
              Post
            </>
          )}
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 bg-red-500/10 border-t border-red-500/30 text-center"
          >
            <span className="text-sm text-red-400">❌ {error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
