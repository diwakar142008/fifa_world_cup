"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };
    const handleEnter = () => setVisible(true);
    const handleLeave = () => setVisible(false);
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button, [role='button'], input, textarea, select, label"));
    };

    let raf: number;
    const animate = () => {
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      if (glowRef.current) glowRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      trailPos.current.x += (pos.current.x - trailPos.current.x) * 0.15;
      trailPos.current.y += (pos.current.y - trailPos.current.y) * 0.15;
      if (trailRef.current) trailRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseover", handleOver);
    raf = requestAnimationFrame(animate);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, [visible]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return null;

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 z-[9999] pointer-events-none" style={{ width: isHovering ? 12 : 8, height: isHovering ? 12 : 8, marginLeft: isHovering ? -6 : -4, marginTop: isHovering ? -6 : -4, borderRadius: "50%", backgroundColor: "#f0c929", opacity: visible ? 1 : 0, transition: "width 0.2s, height 0.2s, margin 0.2s, opacity 0.3s", mixBlendMode: "difference" as const }} aria-hidden="true" />
      <div ref={trailRef} className="fixed top-0 left-0 z-[9998] pointer-events-none" style={{ width: isHovering ? 40 : 32, height: isHovering ? 40 : 32, marginLeft: isHovering ? -20 : -16, marginTop: isHovering ? -20 : -16, borderRadius: "50%", border: `1.5px solid rgba(240, 201, 41, ${isHovering ? 0.6 : 0.3})`, opacity: visible ? 1 : 0, transition: "width 0.3s, height 0.3s, margin 0.3s, border-color 0.3s, opacity 0.3s" }} aria-hidden="true" />
      <div ref={glowRef} className="fixed top-0 left-0 z-[9997] pointer-events-none" style={{ width: 80, height: 80, marginLeft: -40, marginTop: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,201,41,0.08) 0%, transparent 70%)", opacity: visible ? 1 : 0, transition: "opacity 0.3s" }} aria-hidden="true" />
    </>
  );
}
