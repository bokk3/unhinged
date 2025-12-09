"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/components/unhelpful-ai/ChatMessage";
import { ClippyPopup } from "@/components/unhelpful-ai/ClippyPopup";
import { getUnhelpfulResponse, POPUP_MESSAGES } from "@/components/unhelpful-ai/responses";
import { ArrowLeft, Bot, Info, Moon, Sun, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function UnhelpfulAI() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hello! I'm your Unhelpful AI Assistant. Ask me anything, and I'll do my best to not help! 📎" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDismissals, setPopupDismissals] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);

  // Random popup timer
  useEffect(() => {
    const triggerPopup = () => {
      if (Math.random() < 0.3 && !showPopup) {
        setPopupMessage(POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)]);
        setShowPopup(true);
      }
    };

    // Popup on scroll
    const handleScroll = () => triggerPopup();
    // Popup on click
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('button')) {
        triggerPopup();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);

    // Random popup every 15-30 seconds
    const interval = setInterval(() => {
      triggerPopup();
    }, 15000 + Math.random() * 15000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      clearInterval(interval);
    };
  }, [showPopup]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: nextId.current++,
      role: "user",
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setQuestionsAsked(prev => prev + 1);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getUnhelpfulResponse(input);
      const assistantMessage: Message = {
        id: nextId.current++,
        role: "assistant",
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Maybe show a popup after responding
      if (Math.random() < 0.4) {
        setTimeout(() => {
          setPopupMessage("I just gave you advice! Did it help? (It didn't, did it?)");
          setShowPopup(true);
        }, 1000);
      }
    }, 1500 + Math.random() * 2000);
  };

  const handleDismissPopup = () => {
    setShowPopup(false);
    setPopupDismissals(prev => prev + 1);
    
    // Revenge popup
    if (popupDismissals > 2 && Math.random() < 0.3) {
      setTimeout(() => {
        setPopupMessage("You keep closing me, but I keep coming back. We're in this together now.");
        setShowPopup(true);
      }, 3000);
    }
  };

  const clearChat = () => {
    setMessages([
      { id: nextId.current++, role: "assistant", content: "Ah, a fresh start! Let's make new memories of unhelpfulness. 📎" },
    ]);
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
            <Bot size={24} /> Unhelpful AI
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          {/* Description */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> About Me
            </h3>
            <p className="text-xs text-muted-foreground">
              I'm an AI assistant trained on confidently incorrect information. 
              I pop up when you least expect it, and my close button has a mind of its own!
            </p>
          </div>

          {/* Stats */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <h3 className="font-bold text-sm mb-3">Session Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions Asked</span>
                <span>{questionsAsked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Helpful Answers</span>
                <span className="text-red-400">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Popups Dismissed</span>
                <span>{popupDismissals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Popups Coming Back</span>
                <span className="text-yellow-400">∞</span>
              </div>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-bold text-sm mb-2">Try Asking</h3>
            <div className="space-y-2">
              {[
                "Help me with my password",
                "How do I fix this bug?",
                "What's the meaning of life?",
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Chat */}
          <button
            onClick={clearChat}
            className="w-full py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/50 font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Clear Chat
          </button>
        </div>
      </aside>

      {/* Center - Chat */}
      <main className="flex-1 relative bg-neutral-900/50 flex flex-col">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent" />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
          {messages.map(message => (
            <ChatMessage key={message.id} {...message} />
          ))}
          {isTyping && (
            <ChatMessage role="assistant" content="" isTyping />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border relative z-10">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything (I won't help)..."
              className="flex-1 px-4 py-3 bg-secondary rounded-xl border border-border focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 border-l border-border bg-card p-6 flex flex-col gap-6 z-20">
        <div className="flex justify-end">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Tips */}
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-3">💡 "Helpful" Tips</h3>
          <div className="space-y-3 text-xs text-muted-foreground">
            <p>• Ask about passwords for the best security advice (don't actually follow it)</p>
            <p>• Programming questions get extra unhelpful responses</p>
            <p>• The popup will find you. Always.</p>
            <p>• The close button is... special</p>
          </div>
        </div>

        {/* Clippy */}
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
          <div className="text-4xl mb-2">📎</div>
          <p className="text-xs text-yellow-500 font-medium">
            "Remember me? I'm back."
          </p>
        </div>

        <div className="mt-auto text-xs text-center text-muted-foreground">
          <p>Unhinged Projects v0.4.0</p>
          <p className="opacity-50">© 2026 Chaos Corp</p>
        </div>
      </aside>

      {/* Clippy Popup */}
      <AnimatePresence>
        {showPopup && (
          <ClippyPopup 
            message={popupMessage}
            onDismiss={handleDismissPopup}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
