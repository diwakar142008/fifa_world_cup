"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, Sparkles, Loader2 } from "lucide-react";
import clsx from "clsx";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "What is the current crowd status?",
  "Any incidents reported?",
  "Show me real-time attendance",
  "Predict gate congestion",
];

let msgIdCounter = 0;

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "I'm StadiumMind AI, your intelligent stadium operations assistant. Ask me anything about the stadium — crowd levels, incidents, recommendations, or simulations.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef(`session-${++msgIdCounter}`);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const msgId = ++msgIdCounter;
    const userMessage: Message = {
      id: `user-${msgId}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Call real AI API with RAG
    try {
      const msgHistory = messages
        .filter((m) => m.id !== "welcome")
        .slice(-10)
        .map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content,
        }));
      msgHistory.push({ role: "user", content: text });

      const aiMsgId = ++msgIdCounter;
      const result = await api.aiChat(msgHistory, sessionIdRef.current);
      const aiMessage: Message = {
        id: `ai-${aiMsgId}`,
        role: "ai",
        content: result.data.response || "No response from AI.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to get AI response";
      const errId = ++msgIdCounter;
      const errorMessage: Message = {
        id: `error-${errId}`,
        role: "ai",
        content: `Error: ${errMsg}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
          <Brain className="w-4 h-4 text-[#050510]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            StadiumMind AI
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          </h3>
          <p className="text-xs text-stadium-400">Real-time • Connected</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0 mt-1">
                <Brain className="w-3.5 h-3.5 text-[#050510]" />
              </div>
            )}
            <div
              className={clsx(
                "max-w-[85%] rounded-2xl px-4 py-3",
                msg.role === "user"
                  ? "bg-stadium-500/20 text-stadium-100 border border-stadium-500/20"
                  : "bg-white/5 text-stadium-200 border border-white/5",
              )}
            >
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {msg.content.split("\n").map((line, i) => {
                  // Bold markers
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="font-semibold text-white mb-1">
                        {line.slice(2, -2)}
                      </p>
                    );
                  }
                  // List items
                  if (line.startsWith("- ")) {
                    return (
                      <p key={i} className="ml-2 text-stadium-300 mb-0.5">
                        {line}
                      </p>
                    );
                  }
                  // Table-like lines with |
                  if (line.includes("|") && line.split("|").length > 2) {
                    return (
                      <p
                        key={i}
                        className="font-mono text-xs text-stadium-300 mb-0.5"
                      >
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
              <p
                className="text-[10px] text-stadium-500 mt-1.5"
                suppressHydrationWarning
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0">
              <Brain className="w-3.5 h-3.5 text-[#050510]" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/5">
              <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-stadium-400 hover:text-stadium-200 hover:bg-white/10 transition-all border border-white/5"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5 focus-within:border-gold-500/30 focus-within:bg-white/10 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask StadiumMind AI..."
            className="flex-1 bg-transparent text-sm text-white placeholder-stadium-500 outline-none"
            aria-label="Chat input"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
