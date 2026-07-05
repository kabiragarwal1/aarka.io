"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const headlineLines = [
  { text: "BUILDING", style: { color: "var(--fg-heading)" } },
  { text: "AI-FIRST", gradient: true },
  { text: "BUSINESSES.", stroke: true },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: "var(--hero-bg)" }}>
      <motion.div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8" style={{ y: contentY, opacity }}>
        <div className="mb-8 lg:mb-12">
          {headlineLines.map((line, i) => (
            <div key={i} className="split-line">
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`display-xl${line.gradient ? " gradient-text-brand" : ""}`}
                style={
                  line.stroke
                    ? { WebkitTextStroke: "1.5px var(--fg-heading)", color: "transparent" }
                    : line.style ?? { color: "var(--fg-heading)" }
                }
              >
                {line.text}
              </motion.div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <p className="text-lg lg:text-xl max-w-xl leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              <span className="font-black tracking-tight" style={{ color: "var(--fg-heading)", letterSpacing: "-0.04em", fontSize: "1.05em" }}>AARKA</span>
              {" "}is a strategy and product studio that designs AI-native operating models,
              builds intelligent platforms, and turns complex operations into scalable systems.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-8">
              <a href="#ventures" className="label-mono flex items-center gap-2 transition-colors hover:text-white" style={{ color: "var(--fg-muted)" }}>
                See Our Work <span className="text-base">↗</span>
              </a>
              <a href="#contact" className="label-mono flex items-center gap-2 transition-colors hover:text-white" style={{ color: "var(--fg-muted)" }}>
                Get in Touch <span className="text-base">↗</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-wrap lg:justify-end gap-8 lg:gap-12"
          >
            {[
              { value: "18+", label: "Years Experience" },
              { value: "3", label: "AI Ventures" },
              { value: "NYC → Mumbai", label: "Global Reach" },
            ].map((stat, i) => (
              <div key={i} className="text-left">
                <p className="text-3xl lg:text-4xl font-black tracking-tight" style={{ color: "var(--fg-heading)" }}>
                  {stat.value}
                </p>
                <p className="label-mono mt-2" style={{ color: "var(--fg-dim)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-8 right-6 lg:right-8 z-10"
      >
        <span className="label-mono" style={{ color: "var(--fg-dim)" }}>
          (scroll)
        </span>
      </motion.div>
    </section>
  );
}
