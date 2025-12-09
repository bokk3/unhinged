"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

export const ChatMessage = ({ role, content, isTyping }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        role === "user" 
          ? "bg-primary text-primary-foreground" 
          : "bg-yellow-500 text-black"
      }`}>
        {role === "user" ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message */}
      <div className={`max-w-[70%] p-3 rounded-2xl ${
        role === "user"
          ? "bg-primary text-primary-foreground rounded-tr-sm"
          : "bg-secondary text-foreground rounded-tl-sm"
      }`}>
        {isTyping ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </motion.div>
  );
};
