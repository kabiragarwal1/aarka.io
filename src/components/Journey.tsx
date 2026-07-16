"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Building2,
  Rocket,
  Heart,
  Smartphone,
  Megaphone,
  Globe,
  TrendingUp,
} from "lucide-react";

const timeline = [
  {
    period: "2006 – 2008",
    role: "QA & Business Analysis",
    company: "Razorfish",
    links: [],
    logo: "/logos/razorfish.jpg",
    location: "New York",
    icon: Globe,
    description:
      "Quality assurance and business analysis at one of the world's leading interactive agencies.",
    clients: ["Visa", "Velocity Road", "P&G"],
  },
  {
    period: "2008 – 2014",
    role: "User Experience",
    company: "MRY",
    links: [],
    logo: "/logos/mry.png",
    location: "New York",
    icon: Megaphone,
    description:
      "Led user experience at MRY, blending creative innovation with technology strategy for world-class brands.",
    clients: ["Coca-Cola", "Johnson & Johnson", "Visa"],
  },
  {
    period: "2015 – 2017",
    role: "Strategy, Partnerships & BD",
    company: "Health On Demand",
    links: [],
    logo: "/logos/healthondemand.png",
    location: "Mumbai",
    icon: Heart,
    description:
      "Co-founded Health On Demand — a 360-degree ecosystem simplifying everyday well-being.",
    clients: ["DBS Bank", "Schneider Electric", "JBM Auto", "EXL"],
  },
  {
    period: "2017 – 2019",
    role: "Head of User Experience",
    company: "BigSpring.ai",
    links: [],
    logo: "/logos/bigspring.jpg",
    location: "Mumbai",
    icon: Smartphone,
    description:
      "Led user experience at BigSpring, developing a mobile platform with measurable business results.",
    clients: ["Carrier Midea", "Eureka Forbes", "Uber"],
  },
  {
    period: "2019 – 2024",
    role: "Business Analysis",
    company: "Suzy",
    links: [],
    logo: "/logos/suzy.jpg",
    location: "New York / India",
    icon: TrendingUp,
    description:
      "Business analysis at Suzy (formerly Crowdtap). Laid the groundwork for AI execution starting in 2023.",
    clients: [],
  },
  {
    period: "2023 – Present",
    role: "Founder & CEO",
    company: "AARKA",
    links: [],
    logo: "/favicon.svg",
    location: "Global",
    icon: Building2,
    description:
      "Founded AARKA — strategic consulting and AI-first solutions at the intersection of strategy, product, and execution.",
    clients: [],
  },
  {
    period: "2024 – Present",
    role: "Building",
    company: "Senri.ai & Narrastudio.ai",
    links: [
      { label: "Senri.ai", href: "https://senri.ai" },
      { label: "Narrastudio.ai", href: "https://narrastudio.ai" },
    ],
    logo: "/logos/narrastudio.png",
    location: "Global",
    icon: Rocket,
    description:
      "Building AI-first ventures. See What We Build above for details.",
    clients: [],
  },
];

const clients = [
  { name: "Coca-Cola", logo: "/logos/cocacola.jpg" },
  { name: "Razorfish", logo: "/logos/razorfish.jpg" },
  { name: "MRY", logo: "/logos/mry.png" },
  { name: "Johnson & Johnson", logo: "/logos/jnj.png" },
  { name: "American Express", logo: "/logos/americanexpress.png" },
  { name: "Visa", logo: "/logos/visa.png" },
  { name: "DBS Bank", logo: "/logos/dbs.png" },
  { name: "Uber", logo: "/logos/uber.png" },
  { name: "P&G", logo: "/logos/pg.png" },
  { name: "Crayola", logo: "/logos/crayola.png" },
  { name: "Clorox", logo: "/logos/clorox.png" },
  { name: "Philip Morris International", logo: "/logos/philipmorris.png" },
  { name: "BigSpring", logo: "/logos/bigspring.jpg" },
  { name: "Suzy", logo: "/logos/suzy.jpg" },
  { name: "Arixa Capital", logo: "/logos/arixacapital.jpg" },
  { name: "Publicis Media", logo: "/logos/publicismedia.png" },
  { name: "Velocity Road", logo: "/logos/velocityroad.png" },
];

const cardWidth = 400;

function JourneyCard({ item }: { item: typeof timeline[0]; index: number }) {
  const Icon = item.icon;
  return (
    <div
      className="shrink-0 flex flex-col justify-between px-8 lg:px-10 py-10 border-r"
      style={{ width: cardWidth, borderColor: "var(--divider)" }}
    >
      <div>
        <div className="flex items-center gap-3 mb-8">
          {item.logo ? (
            <div className="h-10 min-w-10 flex items-center justify-center overflow-hidden" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid var(--card-border)", borderRadius: 4, maxWidth: 150 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.logo} alt={item.company} className="h-full w-auto max-w-full object-contain p-0.5" />
            </div>
          ) : (
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <Icon size={18} style={{ color: "var(--accent-indigo)" }} />
            </div>
          )}
          <div>
            <span className="label-mono block" style={{ color: "var(--accent-indigo)" }}>
              {item.period}
            </span>
            <span className="label-mono" style={{ color: "var(--fg-dim)" }}>
              {item.location}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-2" style={{ color: "var(--fg-heading)" }}>
          {item.links.length > 0
            ? item.links.map((l, k) => (
                <span key={l.href}>
                  {k > 0 && " & "}
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--accent-indigo)] underline decoration-1 underline-offset-4"
                  >
                    {l.label}
                  </a>
                </span>
              ))
            : item.company}
        </h3>
        <p className="label-mono mb-4" style={{ color: "var(--accent-blue)" }}>
          {item.role}
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          {item.description}
        </p>
      </div>
      {item.clients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {item.clients.map((client, j) => (
            <span
              key={j}
              className="label-mono px-2 py-1"
              style={{ border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--card-tag-text)" }}
            >
              {client}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AnimatedJourneyCard({
  item,
  index,
  scrollYProgress,
  viewportW,
}: {
  item: typeof timeline[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  viewportW: number;
}) {
  // Cards highlight in adjacent pairs as they straddle the viewport center.
  // centerP is the scroll progress at which this card's midpoint crosses the
  // middle of the screen; edge cards that can never reach it clamp to the
  // nearest end, and the final pair holds through the end of the scroll.
  const shift = (timeline.length - 1) * cardWidth;
  const centerP = Math.min(1, Math.max(0, (cardWidth * index + cardWidth / 2 - viewportW / 2) / shift));
  const halfWin = cardWidth / shift;
  const ramp = halfWin / 2;
  const highlight = (p: number) => {
    if (index >= timeline.length - 2 && p >= centerP) return 1;
    const overshoot = Math.max(0, Math.abs(p - centerP) - halfWin);
    return Math.max(0, 1 - overshoot / ramp);
  };
  const opacity = useTransform(scrollYProgress, (p) => 0.4 + 0.6 * highlight(p));
  const scale = useTransform(scrollYProgress, (p) => 0.95 + 0.05 * highlight(p));

  return (
    <motion.div style={{ opacity, scale }}>
      <JourneyCard item={item} index={index} />
    </motion.div>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(1440);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const trackWidth = timeline.length * cardWidth;
  const x = useTransform(scrollYProgress, [0, 1], [0, -(trackWidth - cardWidth)]);

  return (
    <section id="journey" ref={sectionRef} className="relative bg-[var(--bg)] md:h-[300vh]">
      {/* Intro text — in flow on mobile, overlaid on the sticky track on desktop */}
      <div className="md:absolute md:top-0 md:left-0 md:right-0 z-10 pt-24 lg:pt-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="label-mono mb-4 block" style={{ color: "var(--accent-indigo)" }}>
              The Journey
            </span>
            <h2 className="display-lg mb-6" style={{ color: "var(--fg-heading)" }}>
              19+ years of <span className="gradient-text">building</span>.
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll track — desktop only */}
      <div className="hidden md:block sticky top-0 h-screen overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Cards fill available space */}
          <div className="flex-1 flex items-center overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex"
              style={{ x, width: trackWidth }}
            >
              {timeline.map((item, i) => (
                <AnimatedJourneyCard key={i} item={item} index={i} scrollYProgress={scrollYProgress} viewportW={viewportW} />
              ))}
            </motion.div>
          </div>

          {/* Logo marquee — pinned at bottom of sticky viewport */}
          <div
            className="shrink-0 py-4 border-t"
            style={{ borderColor: "var(--divider)", background: "var(--bg)" }}
          >
            <p className="label-mono text-center mb-3" style={{ color: "var(--fg-dim)" }}>
              Brands we&apos;ve worked with
            </p>
            <div className="relative overflow-hidden">
              <div className="marquee-track">
                {[...clients, ...clients].map((client, i) => (
                  <div
                    key={i}
                    className="shrink-0 flex items-center justify-center px-5 py-2 mx-2"
                    style={{ background: "rgba(255,255,255,0.92)", borderRadius: 4 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={client.logo} alt={client.name} className="h-10 w-auto object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stacked cards — mobile */}
      <div className="md:hidden pt-10 px-6 pb-24">
        <div className="space-y-6">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="border-t"
              style={{ borderColor: "var(--divider)" }}
            >
              <JourneyCard item={item} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
