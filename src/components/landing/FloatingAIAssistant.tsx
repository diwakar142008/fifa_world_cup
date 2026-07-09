"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, X, Sparkles, Minimize2, Maximize2 } from "lucide-react";
import clsx from "clsx";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "What's the current crowd status?",
  "Show me live match updates",
  "Any security incidents?",
  "Navigate me to the nearest food court",
];

/**
 * FloatingAIAssistant — A ChatGPT-like floating assistant widget
 * Fixed to bottom-right corner of the landing page.
 */
export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! I'm StadiumMind AI. Ask me anything about the stadium — crowd levels, navigation, food, incidents, or live match info.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let response = "";
      if (lower.includes("crowd") || lower.includes("status")) {
        response =
          "**Current Stadium Status:**\n\n- **Attendance:** 62,843 / 75,000 (83.8%)\n- **Gate A:** 78% capacity (high)\n- **Gate B:** 45% capacity (moderate)\n- **Food Court 4:** Approaching capacity in ~9 min\n\n**AI Recommendation:** Open Food Court 6 and redirect fans from Sections 208-215.";
      } else if (lower.includes("match") || lower.includes("live")) {
        response =
          "**Live Match: BRA 1 - 0 ARG**\n\n- **Minute:** 52'\n- **Possession:** BRA 58% | ARG 42%\n- **Shots:** BRA 8 | ARG 5\n- **xG:** BRA 1.2 | ARG 0.6\n\n**Crowd Energy:** 94% — Electric atmosphere!";
      } else if (lower.includes("security") || lower.includes("incident")) {
        response =
          "**Security Status:**\n\n- **Active Alerts:** 4 (1 critical)\n- **Cameras:** 64/64 online\n- **Personnel:** 28 on duty\n\n**Note:** Unattended bag near Gate C — team dispatched.";
      } else if (lower.includes("food") || lower.includes("eat")) {
        response =
          "**Nearest Food Courts:**\n\n1. **Food Court 2 (East)** — Open, 5 min walk\n2. **Food Court 4 (West)** — Vegetarian options, 8 min walk\n3. **Food Court 3 (South)** — Busy, 12 min wait";
      } else if (lower.includes("navigate") || lower.includes("direction")) {
        response =
          "**Navigation:**\n\nI can help you find the fastest route! Where would you like to go?\n\n- Your Seat\n- Restroom\n- Food Court\n- Exit Gate\n- Medical Station";
      } else {
        response =
          "**AI Analysis:**\n\nBased on current stadium data:\n\n- **Confidence Score:** 87%\n- **Risk Level:** Low\n- **Recommendation:** Monitor Gate B crowd levels — current trend suggests 60% capacity within 20 minutes.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl shadow-gold-500/30 flex items-center justify-center hover:shadow-gold-500/50 transition-shadow"
            aria-label="Open AI Assistant"
          >
            <Brain className="w-6 h-6 text-[#050510]" />
            <span className="absolute inset-0 rounded-full animate-ping bg-gold-500/20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : 520,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={clsx(
              "fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden flex flex-col",
              "bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-gold-500/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#050510]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    StadiumMind AI
                    <Sparkles className="w-3 h-3 text-gold-400" />
                  </h3>
                  <p className="text-[10px] text-stadium-400">
                    Real-time &bull; Multilingual &bull; Connected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-stadium-400 hover:text-white transition-colors"
                  aria-label={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Minimize2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-stadium-400 hover:text-white transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={clsx(
                        "flex gap-2",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "ai" && (
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Brain className="w-3 h-3 text-[#050510]" />
                        </div>
                      )}
                      <div
                        className={clsx(
                          "max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-stadium-500/20 text-stadium-100 border border-stadium-500/20"
                            : "bg-white/5 text-stadium-200 border border-white/5"
                        )}
                      >
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.includes("**")) {
                            const cleaned = line.replace(/\*\*/g, "");
                            return (
                              <p key={i} className="font-semibold text-white mb-0.5">
                                {cleaned}
                              </p>
                            );
                          }
                          if (line.startsWith("- ")) {
                            return (
                              <p key={i} className="ml-1 text-stadium-300">
                                {line}
                              </p>
                            );
                          }
                          return (
                            <p key={i} className="mb-0.5">
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0">
                        <Brain className="w-3 h-3 text-[#050510]" />
                      </div>
                      <div className="rounded-xl px-3 py-2.5 bg-white/5 border border-white/5">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-gold-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested prompts */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedPrompts.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSend(s)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-stadium-400 hover:text-stadium-200 hover:bg-white/10 transition-all border border-white/5"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="px-3 py-3 border-t border-white/5">
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5 focus-within:border-gold-500/30 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent text-sm text-white placeholder-stadium-500 outline-none"
                      aria-label="Chat input"
                    />
                    <button
                      onClick={() => handleSend(input)}
                      disabled={!input.trim() || isTyping}
                      className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-all disabled:opacity-30"
                      aria-label="Send message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
