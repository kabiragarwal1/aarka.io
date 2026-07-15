"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const rows = [
  { title: "Agency to Founder", desc: "World-class agencies (Razorfish, MRY / Publicis) → co-founding ventures → leading product at growth-stage companies." },
  { title: "AI-Native Operator", desc: "Not just advising on AI — actively building. Currently developing Narrastudio.ai and Senri.ai from the ground up." },
  { title: "Full-Stack Builder", desc: "Product strategy, platform architecture, go-to-market, team building. The full stack of building a business." },
  { title: "Cross-Market Experience", desc: "Built products and teams across New York, Mumbai, and globally across different markets and contexts." },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "var(--section-warm)", borderTop: "1px solid var(--divider)", borderBottom: "1px solid var(--divider)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-12">
          {/* Left — name + monogram */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div
                className="w-32 h-32 lg:w-40 lg:h-40 overflow-hidden border-2"
                style={{ background: "var(--bg)", borderColor: "var(--accent-indigo)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/kabir.jpg"
                  alt="Kabir Agarwal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h2 className="display-lg" style={{ color: "var(--fg-heading)" }}>
              Kabir
              <br />
              Agarwal
            </h2>
          </motion.div>

          {/* Right — bio + rows */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <p className="text-lg leading-[1.8] max-w-2xl mb-12" style={{ color: "var(--fg-muted)" }}>
              Entrepreneur and systems thinker with 19+ years across digital strategy,
              product leadership, and AI. From Razorfish and MRY in New York to co-founding
              ventures in Mumbai — I build at the intersection of strategy, technology, and execution.
            </p>

            <div className="space-y-0">
              {rows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="py-6 border-t group"
                  style={{ borderColor: "var(--divider)" }}
                >
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="label-mono shrink-0" style={{ color: "var(--fg-dim)" }}>0{i + 1}</span>
                    <span className="text-xl lg:text-2xl font-black tracking-tight transition-colors group-hover:text-white" style={{ color: "var(--fg-heading)", letterSpacing: "-0.02em" }}>
                      → {row.title}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed ml-10" style={{ color: "var(--fg-muted)" }}>{row.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
