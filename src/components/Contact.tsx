"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Bot, User, Loader2 } from "lucide-react";

/* ── Contact Form ── */
function ContactForm({ inputStyle, preselected }: { inputStyle: React.CSSProperties; preselected?: string }) {
  const [sent, setSent] = useState(false);
  const [interest, setInterest] = useState(preselected || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const type = (form.elements.namedItem("type") as HTMLSelectElement)?.value || "";
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value || "";

    const subject = encodeURIComponent(`[AARKA] ${type || "Inquiry"} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest: ${type}\n\n${message}`);
    window.location.href = `mailto:kabir@aarka.io?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm mb-1.5" style={{ color: "var(--card-body)" }}>Name</label>
        <input type="text" id="name" name="name" required placeholder="Your name" className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-all" style={inputStyle} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm mb-1.5" style={{ color: "var(--card-body)" }}>Email</label>
        <input type="email" id="email" name="email" required placeholder="you@company.com" className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-all" style={inputStyle} />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm mb-1.5" style={{ color: "var(--card-body)" }}>I&apos;m interested in</label>
        <select
          id="type"
          name="type"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-all appearance-none"
          style={inputStyle}
        >
          <option value="">Select an option</option>
          <option value="Consulting">Consulting Engagement</option>
          <option value="Collaboration">Collaborate on a Project</option>
          <option value="Venture">Venture Collaboration</option>
          <option value="Other">Something Else</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm mb-1.5" style={{ color: "var(--card-body)" }}>Message</label>
        <textarea id="message" name="message" rows={3} required placeholder="Tell me about your project or challenge..." className="w-full px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-all resize-none" style={inputStyle} />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-medium hover:opacity-90 transition-all"
        style={{ background: "var(--accent-indigo)" }}
      >
        {sent ? <><Check size={16} /> Email Client Opened</> : <><Send size={16} /> Send Message</>}
      </button>
    </form>
  );
}

/* ── AI Chatbot ── */
type ChatMessage = { role: "bot" | "user"; text: string };

const botKnowledge: Record<string, string> = {
  services: "AARKA offers AI strategy consulting, process mapping, CRM & automation, document intelligence, multi-agent systems design, founder advisory, and AI readiness assessments.",
  ventures: "We're currently building two AI-first ventures:\n• **Narrastudio.ai** — AI-powered storytelling and presentation platform (launching soon)\n• **Senri.ai** — AI-first media planning & buying platform (in development)",
  background: "Kabir Agarwal has 18+ years of experience across digital strategy, product, and AI — from agencies like Razorfish and MRY in New York to co-founding ventures in Mumbai.",
  contact: "You can reach Kabir at kabir@aarka.io or connect on LinkedIn at linkedin.com/in/kabiragarwal",
  pricing: "Pricing depends on the engagement model — we offer consulting retainers, venture collaboration, and strategic advisory. Reach out at kabir@aarka.io to discuss your specific needs.",
  location: "AARKA operates globally with roots in New York and Mumbai.",
};

const suggestions = [
  "What services do you offer?",
  "Tell me about your ventures",
  "What's Kabir's background?",
  "How can I get in touch?",
];

function findBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.match(/servic|offer|do you do|help|consult/)) return botKnowledge.services;
  if (lower.match(/venture|build|product|narrastudio|senri/)) return botKnowledge.ventures;
  if (lower.match(/background|experience|kabir|about|who/)) return botKnowledge.background;
  if (lower.match(/contact|reach|email|linkedin|touch/)) return botKnowledge.contact;
  if (lower.match(/price|cost|rate|fee|pricing|how much/)) return botKnowledge.pricing;
  if (lower.match(/where|location|based|office|city/)) return botKnowledge.location;
  return "I can help with questions about AARKA's services, ventures, Kabir's background, pricing, or how to get in touch. What would you like to know?";
}

function AIChatbot({ inputStyle }: { inputStyle: React.CSSProperties }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi! I'm AARKA's AI assistant. Ask me anything about our services, ventures, or how we can work together." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setTyping(true);

    setTimeout(() => {
      const response = findBotResponse(msg);
      setMessages((prev) => [...prev, { role: "bot", text: response }]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[320px] pr-1" style={{ scrollbarWidth: "thin" }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: msg.role === "bot" ? "rgba(99,102,241,0.1)" : "rgba(6,182,212,0.1)",
                }}
              >
                {msg.role === "bot" ? (
                  <Bot size={14} style={{ color: "var(--accent-indigo)" }} />
                ) : (
                  <User size={14} style={{ color: "var(--accent-cyan)" }} />
                )}
              </div>
              <div
                className={`px-3.5 py-2.5 text-sm leading-relaxed max-w-[80%] ${
                  msg.role === "user" ? "ml-auto" : ""
                }`}
                style={{
                  background: msg.role === "bot" ? "var(--input-bg)" : "rgba(99,102,241,0.1)",
                  color: "var(--card-body)",
                  border: `1px solid ${msg.role === "bot" ? "var(--input-border)" : "rgba(99,102,241,0.2)"}`,
                }}
                dangerouslySetInnerHTML={{
                  __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>"),
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ background: "rgba(99,102,241,0.1)" }}>
              <Bot size={14} style={{ color: "var(--accent-indigo)" }} />
            </div>
            <div className="px-3.5 py-2.5 text-sm" style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)" }}>
              <Loader2 size={14} className="animate-spin" style={{ color: "var(--accent-indigo)" }} />
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="text-xs px-3 py-1.5 transition-all hover:opacity-80"
              style={{
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--card-body)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 px-4 py-2.5 rounded-sm text-sm focus:outline-none transition-all"
          style={inputStyle}
        />
        <button
          onClick={() => handleSend()}
          className="px-3.5 py-2.5 text-white transition-all hover:opacity-90"
          style={{ background: "var(--accent-indigo)" }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<"form" | "chat">("chat");
  const [preselected, setPreselected] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      if (value) {
        setPreselected(value);
        setActiveTab("form");
      }
    };
    window.addEventListener("aarka:select-interest", handler);
    return () => window.removeEventListener("aarka:select-interest", handler);
  }, []);

  const inputStyle: React.CSSProperties = {
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--input-text)",
  };

  return (
    <section id="contact" ref={ref} className="relative py-24 lg:py-32 overflow-hidden" style={{ background: "var(--section-warm)" }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-xl" style={{ color: "var(--fg-heading)" }}>
            LET&apos;S TALK
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 mb-8"
        >
          <a
            href="mailto:kabir@aarka.io"
            className="block text-3xl lg:text-[40px] font-semibold tracking-tight transition-colors hover:text-[var(--accent-indigo)]"
            style={{ color: "var(--fg-heading)" }}
          >
            kabir@aarka.io
          </a>
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <a
              href="https://linkedin.com/in/kabiragarwal"
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono transition-colors hover:text-white"
              style={{ color: "var(--fg-muted)" }}
            >
              LinkedIn
            </a>
            <a
              href="https://aarka.io"
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono transition-colors hover:text-white"
              style={{ color: "var(--fg-muted)" }}
            >
              aarka.io
            </a>
          </div>
        </motion.div>

        <div className="border-t mb-16" style={{ borderColor: "var(--divider)" }} />

        {/* Tabbed Form / AI Chat */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto p-8"
          style={{ border: "1px solid var(--card-border)", background: "var(--card-bg)" }}
        >
          {/* Tab switcher */}
          <div className="flex gap-1 p-1 mb-6" style={{ background: "var(--input-bg)" }}>
            <button
              onClick={() => setActiveTab("chat")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all"
              style={{
                background: activeTab === "chat" ? "var(--accent-indigo)" : "transparent",
                color: activeTab === "chat" ? "#fff" : "var(--card-body)",
              }}
            >
              <Bot size={14} />
              Ask AI
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all"
              style={{
                background: activeTab === "form" ? "var(--accent-indigo)" : "transparent",
                color: activeTab === "form" ? "#fff" : "var(--card-body)",
              }}
            >
              <Send size={14} />
              Send Message
            </button>
          </div>

          {activeTab === "chat" ? (
            <AIChatbot inputStyle={inputStyle} />
          ) : (
            <ContactForm key={preselected} inputStyle={inputStyle} preselected={preselected} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
