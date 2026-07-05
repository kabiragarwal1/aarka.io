"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const engagementModels = [
  {
    title: "Consulting Engagement",
    desc: "Strategic operating reviews, AI-readiness assessments, and execution design. Ideal for companies looking to modernize operations or enter new markets.",
    cta: "Typically 4–12 weeks",
    contactValue: "Consulting",
  },
  {
    title: "Collaborate on Projects",
    desc: "We're always building — and we want the right people in the room. Join one of our active ventures, or bring your team to co-build with us.",
    cta: "Open collaboration",
    contactValue: "Collaboration",
  },
  {
    title: "Venture Collaboration",
    desc: "Looking for a co-builder or strategic partner for an AI-native product? We bring capital strategy, product thinking, and execution capability.",
    cta: "Equity or hybrid",
    contactValue: "Venture",
  },
];

function WorkRow({ model }: { model: typeof engagementModels[0] }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("aarka:select-interest", { detail: model.contactValue }));
  };

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className="group block border-b transition-colors duration-[350ms] ease-out"
      style={{
        borderColor: "var(--divider)",
        background: hovered ? "rgba(99,102,241,0.05)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="display-lg" style={{ color: "var(--fg-heading)" }}>
              {model.title}
            </h3>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <span className="label-mono hidden lg:block" style={{ color: "var(--fg-dim)" }}>
              {model.cta}
            </span>
            <span className="text-2xl font-semibold transition-colors duration-300 group-hover:text-white" style={{ color: "var(--accent-indigo)" }}>
              &rarr; Get Started
            </span>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-[350ms] ease-out"
          style={{ maxHeight: hovered ? "120px" : "0px", opacity: hovered ? 1 : 0 }}
        >
          <p className="pt-6 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            {model.desc}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function WorkWithMe() {
  return (
    <section id="work-with-us" className="relative overflow-hidden" style={{ background: "var(--section-warm)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="display-xl text-stroke" style={{ color: "transparent" }}>
            WORK WITH US
          </h2>
        </motion.div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--divider)" }}>
        {engagementModels.map((model, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <WorkRow model={model} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
