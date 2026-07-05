"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorProvider({ children }: { children: React.ReactNode }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(hover: none) or (pointer: coarse) or (max-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const cursor = cursorRef.current;
    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => cursor.classList.add("hover");
    const onLeave = () => cursor.classList.remove("hover");

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    const interactives = document.querySelectorAll("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [isMobile]);

  return (
    <>
      {children}
      {!isMobile && <div id="cursor" ref={cursorRef} />}
    </>
  );
}
