"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Radio,
  TrendingUp,
  BarChart3,
  Cpu,
  Presentation,
  BookOpen,
  Palette,
  Server,
  ExternalLink,
  Map,
  Bot,
  ScanLine,
  Users,
  GitBranch,
  FlaskConical,
} from "lucide-react";

/* ── Ventures data ── */
const ventures = [
  {
    name: "Narrastudio.ai",
    tagline: "AI-Powered Storytelling Platform",
    status: "launching" as const,
    number: "01",
    description:
      "Transforms complex ideas into strategic, investor-ready outputs. Structured thinking and presentation clarity as a competitive advantage.",
    link: "https://narrastudio.ai",
    features: [
      { icon: Presentation, label: "Agent-driven generation" },
      { icon: BookOpen, label: "Narrative design" },
      { icon: Palette, label: "Brand automation" },
      { icon: Server, label: "Content infrastructure" },
    ],
  },
  {
    name: "Senri.ai",
    tagline: "AI-First Media Planning & Buying",
    status: "development" as const,
    number: "02",
    description:
      "Automating campaign setup, optimizing budget allocation in real time, and creating predictive performance intelligence for modern marketing teams.",
    link: "https://senri.ai",
    features: [
      { icon: Radio, label: "Cross-channel optimization" },
      { icon: TrendingUp, label: "Automated budget reallocation" },
      { icon: BarChart3, label: "Predictive ROAS modeling" },
      { icon: Cpu, label: "AI-assisted media ops" },
    ],
  },
];

/* ── Services data ── */
const services = [
  { icon: Map, title: "Process Mapping", desc: "End-to-end operational review across every lifecycle stage." },
  { icon: Bot, title: "CRM & Automation", desc: "Automation layering across sales, pipeline, and customer workflows." },
  { icon: ScanLine, title: "Document Intelligence", desc: "OCR integration for data extraction, validation, and compliance." },
  { icon: GitBranch, title: "Multi-Agent Systems", desc: "AI agent architectures for autonomous business operations." },
  { icon: Users, title: "Founder Advisory", desc: "Translating vision into implementation-ready roadmaps." },
  { icon: FlaskConical, title: "AI Readiness", desc: "Organizational readiness assessments with clear blueprints." },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon;
  const num = String(index + 1).padStart(2, "0");
  return (
    <div
      className="group p-7 flex flex-col gap-4 transition-colors duration-300"
      style={{
        border: "1px solid var(--card-border)",
        background: "var(--card-bg)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-indigo)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--card-border)"; }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 flex items-center justify-center shrink-0"
          style={{ background: "rgba(99,102,241,0.1)" }}
        >
          <Icon size={16} style={{ color: "var(--accent-indigo)" }} />
        </div>
        <span className="label-mono" style={{ color: "var(--fg-dim)" }}>{num}</span>
      </div>
      <h3
        className="font-black tracking-tight"
        style={{ fontSize: "clamp(18px, 2vw, 22px)", letterSpacing: "-0.02em", color: "var(--fg-heading)" }}
      >
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
        {service.desc}
      </p>
    </div>
  );
}

export default function WhatWeDo() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="ventures" ref={ref} className="relative overflow-hidden">
      {/* ── Ventures subsection ── */}
      <div className="relative z-10 py-24 lg:py-32" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <span className="label-mono mb-4 block" style={{ color: "var(--accent-indigo)" }}>
              What We Build
            </span>
            <h2 className="display-lg" style={{ color: "var(--fg-heading)" }}>
              Ventures & <span className="gradient-text-brand">Platforms</span>
            </h2>
          </motion.div>

          <div className="space-y-0">
            {ventures.map((venture, i) => (
              <div
                key={venture.name}
                className="group relative border-b"
                style={{ borderColor: "var(--divider)" }}
              >
                <div className="relative overflow-hidden">
                  {/* Hover kinetic number */}
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 font-black leading-none pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-150 ${i % 2 === 1 ? "right-0" : "left-0"}`}
                    style={{
                      color: "var(--fg-heading)",
                      fontSize: "clamp(120px, 20vw, 320px)",
                      opacity: 0.06,
                    }}
                  >
                    {venture.number}
                  </span>

                  <div className={`relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 py-16 lg:py-24 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    <div className={`${i % 2 === 1 ? "lg:order-2" : ""} border-l-4 pl-6 lg:pl-8`} style={{ borderColor: "var(--accent-indigo)" }}>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="label-mono" style={{ color: "var(--accent-indigo)" }}>
                          {venture.number}
                        </span>
                        <span className="label-mono px-2 py-0.5" style={{ color: "var(--fg-muted)", border: "1px solid var(--card-border)" }}>
                          {venture.status === "launching" ? "Launching Soon" : "In Development"}
                        </span>
                        {venture.link && (
                          <a href={venture.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--fg-dim)" }} className="hover:text-white transition-colors">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <h3 className="text-3xl lg:text-5xl font-black tracking-tight mb-3" style={{ color: "var(--fg-heading)" }}>
                        {venture.link ? (
                          <a
                            href={venture.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-[var(--accent-indigo)]"
                          >
                            {venture.name}
                          </a>
                        ) : (
                          venture.name
                        )}
                      </h3>
                      <p className="label-mono mb-4" style={{ color: "var(--accent-indigo)" }}>
                        {venture.tagline}
                      </p>
                      <p className="text-lg leading-relaxed max-w-lg" style={{ color: "var(--fg-muted)" }}>
                        {venture.description}
                      </p>
                    </div>

                    <div className={`${i % 2 === 1 ? "lg:order-1" : ""} flex flex-col justify-center`}>
                      <div className="space-y-3">
                        {venture.features.map((feat, j) => (
                          <div key={j} className="flex items-center gap-4 py-3 border-b" style={{ borderColor: "var(--divider)" }}>
                            <feat.icon size={18} className="shrink-0" style={{ color: "var(--accent-indigo)" }} />
                            <span className="text-base font-medium" style={{ color: "var(--fg-heading)" }}>{feat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Services subsection ── */}
      <div id="services" className="relative z-10 py-24 lg:py-32" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <span className="label-mono mb-4 block" style={{ color: "var(--accent-indigo)" }}>
              Through AARKA
            </span>
            <h2 className="display-lg" style={{ color: "var(--fg-heading)" }}>
              Services & <span className="gradient-text-cool">Consulting</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--divider)" }}>
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <ServiceCard service={service} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
