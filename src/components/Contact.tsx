"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Check, Loader2 } from "lucide-react";

/* ── Contact Form ── */
type FormStatus = "idle" | "sending" | "sent" | "error";

function ContactForm({ inputStyle, preselected }: { inputStyle: React.CSSProperties; preselected?: string }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [interest, setInterest] = useState(preselected || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value || "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value || "";
    const type = (form.elements.namedItem("type") as HTMLSelectElement)?.value || "";
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value || "";
    const company = (form.elements.namedItem("company") as HTMLInputElement)?.value || "";

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message, company }),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setInterest("");
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
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
      {/* Honeypot — hidden from humans, catches bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
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
        disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-medium hover:opacity-90 transition-all disabled:opacity-60"
        style={{ background: "var(--accent-indigo)" }}
      >
        {status === "sending" && <><Loader2 size={16} className="animate-spin" /> Sending...</>}
        {status === "sent" && <><Check size={16} /> Message Sent</>}
        {(status === "idle" || status === "error") && <><Send size={16} /> Send Message</>}
      </button>
      {status === "error" && (
        <p className="text-sm text-center" style={{ color: "var(--card-body)" }}>
          Something went wrong. Please email{" "}
          <a href="mailto:kabir@aarka.io" className="underline" style={{ color: "var(--accent-indigo)" }}>
            kabir@aarka.io
          </a>{" "}
          directly.
        </p>
      )}
    </form>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [preselected, setPreselected] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      if (value) setPreselected(value);
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto p-8"
          style={{ border: "1px solid var(--card-border)", background: "var(--card-bg)" }}
        >
          <ContactForm key={preselected} inputStyle={inputStyle} preselected={preselected} />
        </motion.div>
      </div>
    </section>
  );
}
