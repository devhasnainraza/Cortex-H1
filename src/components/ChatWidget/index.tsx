import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useUser } from "@clerk/clerk-react";
import getDb from "../../lib/db";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Trash2,
  X,
  Send,
  Copy,
  Check,
  FileText,
  Lightbulb,
  Zap,
  BookOpen,
  User as UserIcon,
  Loader2,
  Bot,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Activity,
  ArrowUp,
  HelpCircle,
  Code2,
} from "lucide-react";

// --- Message Types ---
type Message = {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
};

export default function ChatWidget() {
  const { siteConfig } = useDocusaurusContext();
  const { user } = useUser();

  // Widget visibility & geometry states
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "like" | "dislike" | null>>({});

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // Text selection state
  const [selectedText, setSelectedText] = useState<string>("");
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [showAskButton, setShowAskButton] = useState(false);

  // Scrolling & refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  const neonUrl = siteConfig?.customFields?.neonConnectionString as string;
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Safe input setter
  const safeSetInput = (value: any) => {
    const safeValue = (value ?? "").toString();
    setInput(safeValue);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: any) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          safeSetInput(transcript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  // Load chat history from Neon DB
  const loadHistory = async () => {
    if (!user || !neonUrl) {
      setMessages([
        {
          id: "init",
          role: "model",
          content: "Welcome to **Cortex-H1 Assistant**! Ask me anything about ROS 2, Isaac Sim, kinematics, or VLA models.",
          timestamp: Date.now(),
        },
      ]);
      return;
    }
    try {
      const sql = getDb(neonUrl);
      if (!sql) throw new Error("DB connection failed.");
      const data: any[] = await sql`
        SELECT id::text, role, content, timestamp 
        FROM chat_messages 
        WHERE user_id = ${user.id} 
        ORDER BY timestamp ASC
      `;
      if (data.length > 0) {
        setMessages(data.map((msg) => ({ ...msg, timestamp: Number(msg.timestamp) })));
      } else {
        setMessages([
          {
            id: "init",
            role: "model",
            content: `Welcome back, **${user.firstName || "Engineer"}**! Ready to build autonomous humanoid systems?`,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (e) {
      console.error("Neon Load Error:", e);
    }
  };

  // Save message to state and Neon DB
  const saveMessage = async (msg: { role: "user" | "model"; content: string; timestamp?: number }) => {
    const safeContent = (msg.content || "").toString();
    const fullMessage: Message = {
      id: Date.now().toString(),
      role: msg.role,
      content: safeContent,
      timestamp: msg.timestamp || Date.now(),
    };
    setMessages((prev) => [...prev, fullMessage]);
    if (user && neonUrl) {
      try {
        const sql = getDb(neonUrl);
        if (sql) {
          await sql`
            INSERT INTO chat_messages (user_id, role, content, timestamp) 
            VALUES (${user.id}, ${msg.role}, ${safeContent}, ${Date.now()})
          `;
        }
      } catch (err) {
        console.error("Neon save error:", err);
      }
    }
  };

  const updateMessageContent = (id: string, newContent: string) => {
    const safeContent = (newContent || "").toString();
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content: safeContent } : msg))
    );
  };

  const clearHistory = async () => {
    setMessages([]);
    if (user && neonUrl) {
      try {
        const sql = getDb(neonUrl);
        if (sql) await sql`DELETE FROM chat_messages WHERE user_id = ${user.id}`;
      } catch (e) {
        console.error("Neon clear error:", e);
      }
    }
  };

  // Context extraction from active page
  useEffect(() => {
    const updateContext = () => {
      try {
        const contentDiv = document.querySelector("main");
        if (contentDiv) {
          const textContent = `${contentDiv.textContent || ""}`.substring(0, 30000);
          setContext(textContent);
        } else {
          setContext("");
        }
      } catch (e) {
        console.error("Context extraction error:", e);
        setContext("");
      }
    };
    setTimeout(updateContext, 1000);
  }, []);

  // Scrolling logic
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsUserNearBottom(isNearBottom);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isUserNearBottom && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [messages, isUserNearBottom]);

  // Load history on mount or auth change
  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  // Text selection popup
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setShowAskButton(false);
        return;
      }

      const rawText = selection.toString();
      const cleanText = (rawText || "").toString().trim();
      if (cleanText.length < 3) {
        setShowAskButton(false);
        return;
      }

      const anchorNode = selection.anchorNode;
      const focusNode = selection.focusNode;
      const isInsideWidget = (node: Node | null) =>
        node?.parentElement?.closest?.("[data-chat-widget]");

      if (isInsideWidget(anchorNode) || isInsideWidget(focusNode)) {
        setShowAskButton(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      let top = rect.top + scrollY - 45;
      let left = rect.left + scrollX + rect.width / 2;

      if (rect.top < 50) {
        top = rect.bottom + scrollY + 10;
      }

      setSelectedText(cleanText);
      setButtonPosition({ top, left });
      setShowAskButton(true);
    };

    let timeoutId: any;
    const debouncedHandleSelection = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleSelection, 100);
    };

    const handleClear = () => setShowAskButton(false);

    document.addEventListener("mouseup", debouncedHandleSelection);
    document.addEventListener("touchend", debouncedHandleSelection);
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") handleClear();
    });
    document.addEventListener("scroll", handleClear, { capture: true, passive: true });

    return () => {
      document.removeEventListener("mouseup", debouncedHandleSelection);
      document.removeEventListener("touchend", debouncedHandleSelection);
      document.removeEventListener("keyup", handleClear);
      document.removeEventListener("scroll", handleClear);
      clearTimeout(timeoutId);
    };
  }, []);

  // Voice recording
  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech recognition start failed", e);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (e) {
        console.error("Speech recognition stop failed", e);
      }
    }
  };

  // Submit prompt
  const handleSubmit = async (overrideMsg?: string) => {
    let finalMsg = "";
    if (overrideMsg != null && typeof overrideMsg === "string" && overrideMsg.trim()) {
      finalMsg = overrideMsg.trim();
    } else if (input != null) {
      finalMsg = typeof input === "string" ? input.trim() : String(input).trim();
    }

    if (!finalMsg) return;

    saveMessage({ role: "user", content: finalMsg });
    safeSetInput("");

    if (!isOpen) setIsOpen(true);
    setShowAskButton(false);

    const groqKey = (
      (siteConfig.customFields?.groqApiKey as string) ||
      (typeof window !== "undefined" ? localStorage.getItem("groq_api_key") : "") ||
      ""
    )?.trim();
    const groqModel = (siteConfig.customFields?.groqModel as string) || "qwen/qwen3.8-27b";

    if (!groqKey) {
      saveMessage({
        role: "model",
        content: "⚠️ Groq API Key not configured. Please add `GROQ_API_KEY=gsk_...` to your `.env` file.",
        timestamp: Date.now(),
      });
      return;
    }

    try {
      const streamingMessageId = `streaming-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: streamingMessageId,
          role: "model",
          content: "",
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]);

      const sysPrompt = `You are Cortex Assistant, an expert AI tutor for the physical humanoid robotics textbook Cortex-H1.
${context ? `Selected page context: "${context.slice(0, 4000)}"\n` : ""}
Answer the question authoritatively, technically, and concisely using Markdown formatting, math formulas, and code blocks where relevant.`;

      const apiMessages = [
        { role: "system", content: sysPrompt },
        ...messages.slice(-6).map((m) => ({
          role: m.role === "model" ? "assistant" : "user",
          content: m.content,
        })),
        { role: "user", content: finalMsg },
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: groqModel,
          messages: apiMessages,
          stream: true,
          temperature: 0.6,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Groq API returned status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ") && trimmed !== "data: [DONE]") {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content || "";
                fullText += delta;
                updateMessageContent(streamingMessageId, fullText);
              } catch (e) {}
            }
          }
        }
      }

      const safeFullText = (fullText || "").toString();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageId
            ? { ...msg, isStreaming: false, content: safeFullText }
            : msg
        )
      );

      if (user && neonUrl) {
        const sql = getDb(neonUrl);
        if (sql) {
          await sql`
            INSERT INTO chat_messages (user_id, role, content, timestamp) 
            VALUES (${user.id}, 'model', ${safeFullText}, ${Date.now()})
          `;
        }
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((msg) => !msg.isStreaming));
      saveMessage({
        role: "model",
        content: `❌ Request Error: ${error.message}`,
        timestamp: Date.now(),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    setFeedback((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type,
    }));
  };

  const speakMessage = (text: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingId(id);
    }
  };

  // --- Quick Actions Bar ---
  const QuickActions = () => {
    const actions = [
      { label: "Summarize Page", icon: <FileText size={13} />, action: "Summarize the key points of this page." },
      { label: "Explain Code", icon: <Code2 size={13} />, action: "Explain the code snippets and architecture on this page." },
      { label: "Quiz Me", icon: <Lightbulb size={13} />, action: "Test my knowledge with 3 questions about this chapter." },
      { label: "Translate to Urdu", icon: <Zap size={13} />, action: "Summarize this page in clear Urdu." },
    ];

    return (
      <div
        className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar scrollbar-none select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {actions.map((act) => (
          <button
            key={act.label}
            type="button"
            onClick={() => handleSubmit(act.action)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 transition-all shrink-0 cursor-pointer"
          >
            <span className="text-emerald-600 dark:text-emerald-400">{act.icon}</span>
            <span>{act.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // --- Header Component ---
  const Header = () => (
    <div className="relative z-10 px-4 py-3.5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 shrink-0">
          <Bot size={19} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight m-0">
              Cortex Assistant
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 leading-none">
              Copilot
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-none font-sans">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Online</span>
            <span>•</span>
            <span>{user?.firstName ? `Welcome, ${user.firstName}` : "Physical AI Copilot"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear current chat history?")) clearHistory();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border-0 bg-transparent cursor-pointer"
          title="Clear History"
        >
          <Trash2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-0 bg-transparent cursor-pointer"
          title={isExpanded ? "Minimize" : "Expand"}
        >
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-0 bg-transparent cursor-pointer"
          title="Close Chat"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 🚀 Ask AI Selection Button */}
      {showAskButton && buttonPosition && (
        <div
          className="fixed z-[10000] bg-slate-900 text-white dark:bg-emerald-600 px-3 py-1.5 rounded-full shadow-2xl border border-slate-700 dark:border-emerald-400/30 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all text-xs font-semibold"
          style={{
            left: `${buttonPosition.left}px`,
            top: `${buttonPosition.top}px`,
            transform: "translateX(-50%)",
          }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit(`Explain this specifically for humanoid robotics: "${selectedText}"`);
          }}
        >
          <Sparkles size={13} className="text-emerald-400 dark:text-white" />
          <span>Ask Cortex AI</span>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center border-0 cursor-pointer group"
          title="Open Cortex Assistant"
        >
          <Bot className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </span>
        </button>
      )}

      {/* CHAT MODAL WINDOW */}
      <div
        data-chat-widget
        className={`fixed z-[9999] flex flex-col font-sans transition-all duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0 scale-100"
            : "opacity-0 pointer-events-none translate-y-8 scale-95"
        } ${
          isExpanded
            ? "inset-4 sm:inset-8 rounded-2xl"
            : "bottom-4 right-4 w-[92vw] h-[82vh] sm:w-[440px] sm:max-h-[680px] rounded-2xl"
        } shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden`}
      >
        <Header />

        {/* Scrollable Messages Area */}
        <div
          ref={messagesContainerRef}
          className="relative z-10 flex-1 overflow-y-auto chat-scroll p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-6 px-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-sm">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1.5">
                How can I assist your robotics engineering?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                Ask questions about ROS 2 Humble, Isaac Sim physics, Visual SLAM, or multimodal VLA models.
              </p>

              {/* 4 Starter Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
                {[
                  {
                    icon: "🦾",
                    title: "Inverse Kinematics",
                    prompt: "Explain Inverse Kinematics for humanoid bipedal legs.",
                  },
                  {
                    icon: "🧠",
                    title: "VLA Foundation Models",
                    prompt: "How do Vision-Language-Action models predict joint trajectories?",
                  },
                  {
                    icon: "⚡",
                    title: "ROS 2 DDS QoS",
                    prompt: "What is the optimal DDS QoS profile for real-time motor actuation?",
                  },
                  {
                    icon: "🔬",
                    title: "Sim-to-Real Transfer",
                    prompt: "How does domain randomization help transfer from Isaac Sim to physical hardware?",
                  },
                ].map((card, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => handleSubmit(card.prompt)}
                    className="p-3 rounded-xl text-left bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{card.icon}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed m-0">
                      {card.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex w-full gap-2.5 transition-all ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "model" && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot size={15} />
                </div>
              )}

              <div className={`max-w-[85%] group ${m.role === "user" ? "order-first" : ""}`}>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-sm"
                      : "bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-sm"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !String(children).includes("\n");
                        return !isInline && match ? (
                          <div className="relative group/code my-2.5 rounded-xl overflow-hidden border border-slate-700/80 bg-[#0d1117]">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-slate-800 text-[11px] font-mono text-slate-400">
                              <span>{match[1]}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(String(children).replace(/\n$/, ""), `code-${m.id}`)
                                }
                                className="inline-flex items-center gap-1 hover:text-white transition-colors bg-transparent border-0 cursor-pointer text-slate-400 text-[10px]"
                              >
                                {copiedId === `code-${m.id}` ? (
                                  <>
                                    <Check size={11} className="text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                padding: "0.85rem",
                                background: "transparent",
                                fontSize: "0.78rem",
                              }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code
                            className={`px-1.5 py-0.5 rounded text-xs font-mono font-semibold ${
                              m.role === "user"
                                ? "bg-white/20 text-white"
                                : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            }`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-xs sm:text-sm" {...props} />,
                      ul: ({ node, ...props }) => <ul className="mb-2 pl-4 list-disc text-xs sm:text-sm space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="mb-2 pl-4 list-decimal text-xs sm:text-sm space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li {...props} />,
                      a: ({ node, href, ...props }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-semibold underline ${
                            m.role === "user"
                              ? "text-white"
                              : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                          }`}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>

                  {/* Model Action Toolbar */}
                  {m.role === "model" && !m.isStreaming && (
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-750 text-slate-400">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(m.content, m.id)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-0 bg-transparent cursor-pointer"
                        title="Copy Message"
                      >
                        {copiedId === m.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback(m.id, "like")}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-0 bg-transparent cursor-pointer ${
                          feedback[m.id] === "like" ? "text-emerald-500" : "hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                        title="Good answer"
                      >
                        <ThumbsUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback(m.id, "dislike")}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-0 bg-transparent cursor-pointer ${
                          feedback[m.id] === "dislike" ? "text-rose-500" : "hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                        title="Poor answer"
                      >
                        <ThumbsDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => speakMessage(m.content, m.id)}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-0 bg-transparent cursor-pointer ${
                          speakingId === m.id ? "text-emerald-500" : "hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                        title="Read aloud"
                      >
                        {speakingId === m.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      </button>
                    </div>
                  )}

                  {/* Streaming indicator */}
                  {m.isStreaming && (
                    <div className="flex items-center gap-1.5 py-1 text-xs text-emerald-500 font-mono mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-300" />
                      <span className="text-[11px] text-slate-400 ml-1">Reasoning...</span>
                    </div>
                  )}
                </div>

                <div
                  className={`text-[10px] text-slate-400 mt-1 px-1 ${
                    m.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <UserIcon size={15} />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock Area */}
        <div className="relative z-10 p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <QuickActions />

          <div className="relative flex items-end gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus-within:border-emerald-500/80 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => safeSetInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about ROS 2, Isaac Sim, VLA..."
              className="flex-1 bg-transparent border-0 outline-none text-slate-900 dark:text-white py-1.5 px-2.5 resize-none text-xs sm:text-sm min-h-[38px] max-h-[140px] leading-relaxed placeholder:text-slate-400 font-sans no-scrollbar scrollbar-none"
              style={{
                overflowY: input.split("\n").length > 4 ? "auto" : "hidden",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              rows={1}
            />

            {/* Voice Input Mic */}
            {isSpeechSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-all border-0 cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-dark dark:bg-slate-750 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700"
                }`}
                title={isListening ? "Stop voice recording" : "Voice input"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!input.trim()}
              className={`p-2 rounded-lg transition-all border-0 flex items-center justify-center cursor-pointer ${
                input.trim()
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95"
                  : "bg-slate-200 dark:bg-slate-700/60 text-slate-400 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <Send size={15} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span>Press Enter to send • Shift+Enter for newline</span>
            <span>{input.length}/2000</span>
          </div>
        </div>
      </div>
    </>
  );
}