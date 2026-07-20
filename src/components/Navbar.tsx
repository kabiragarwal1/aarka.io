"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "What We Do", href: "#ventures" },
  { label: "Journey", href: "#journey" },
  { label: "Work With Us", href: "#work-with-us" },
];

const sectionIds = navLinks.map((l) => l.href.slice(1));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 50), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const best = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          );
          setActiveSection(best.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? "var(--nav-scrolled)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--surface-border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="font-black tracking-tight text-lg" style={{ color: "var(--fg-heading)", letterSpacing: "-0.03em" }}>
              AARKA
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="label-mono relative group"
                    style={{ color: isActive ? "var(--fg-heading)" : "var(--fg-dim)" }}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                      style={{ background: "var(--accent-indigo)" }}
                    />
                  </a>
                );
              })}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <motion.a
                href="#contact"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="label-mono px-5 py-2.5 text-white transition-opacity hover:opacity-80"
                style={{ background: "var(--accent-indigo)" }}
              >
                Let&apos;s Talk &rarr;
              </motion.a>
            </div>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                aria-label="Toggle menu"
                style={{ color: "var(--fg-heading)" }}
              >
                <motion.span
                  animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="block w-6 h-px"
                  style={{ background: "currentColor" }}
                />
                <motion.span
                  animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="block w-6 h-px"
                  style={{ background: "currentColor" }}
                />
                <motion.span
                  animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="block w-6 h-px"
                  style={{ background: "currentColor" }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center px-8 md:hidden"
            style={{ background: "var(--bg)" }}
          >
            <div className="flex flex-col gap-2 mt-16">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  className="font-black leading-none tracking-tight border-b py-5"
                  style={{
                    fontSize: "clamp(40px, 12vw, 80px)",
                    letterSpacing: "-0.03em",
                    color: activeSection === link.href.slice(1) ? "var(--accent-indigo)" : "var(--fg-heading)",
                    borderColor: "var(--surface-border)",
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.42 }}
                className="label-mono mt-8 inline-flex items-center gap-2 text-white px-6 py-4"
                style={{ background: "var(--accent-indigo)", width: "fit-content" }}
              >
                Let&apos;s Talk &rarr;
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
