"use client";

import { useEffect, useRef, useCallback } from "react";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const trails = useRef<{ x: number; y: number; alpha: number; size: number }[]>([]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseDown = useCallback((e: MouseEvent) => {
    const ripple = document.createElement("div");
    ripple.className = "fixed pointer-events-none rounded-full z-[9997]";
    ripple.style.left = `${e.clientX - 50}px`;
    ripple.style.top = `${e.clientY - 50}px`;
    ripple.style.width = "100px";
    ripple.style.height = "100px";
    ripple.style.border = "2px solid rgba(57,255,20,0.3)";
    ripple.style.animation = "cursorRipple 0.6s ease-out forwards";
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  const onMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a")
    ) {
      if (cursorRef.current) {
        cursorRef.current.style.width = "48px";
        cursorRef.current.style.height = "48px";
        cursorRef.current.style.borderColor = "rgba(57,255,20,0.6)";
        cursorRef.current.style.backgroundColor = "rgba(57,255,20,0.05)";
      }
    }
  }, []);

  const onMouseOut = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.width = "24px";
      cursorRef.current.style.height = "24px";
      cursorRef.current.style.borderColor = "rgba(57,255,20,0.4)";
      cursorRef.current.style.backgroundColor = "transparent";
    }
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes cursorRipple {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);

    const addHoverListeners = (el: Element) => {
      (el as HTMLElement).addEventListener("mouseenter", onMouseOver as EventListener);
      (el as HTMLElement).addEventListener("mouseleave", onMouseOut as EventListener);
    };

    const removeHoverListeners = (el: Element) => {
      (el as HTMLElement).removeEventListener("mouseenter", onMouseOver as EventListener);
      (el as HTMLElement).removeEventListener("mouseleave", onMouseOut as EventListener);
    };

    document.querySelectorAll("button, a").forEach(addHoverListeners);

    const observer = new MutationObserver(() => {
      document.querySelectorAll("button, a").forEach((el) => {
        removeHoverListeners(el);
        addHoverListeners(el);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const canvasEl = trailRef.current!;
    const ctx = canvasEl.getContext("2d")!;
    let cw = canvasEl.width;
    let ch = canvasEl.height;

    function resize() {
      cw = canvasEl.width = window.innerWidth;
      ch = canvasEl.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function animate() {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x - 12}px`;
        cursorRef.current.style.top = `${pos.current.y - 12}px`;
      }

      trails.current.push({
        x: pos.current.x,
        y: pos.current.y,
        alpha: 0.5,
        size: 3,
      });

      if (trails.current.length > 20) {
        trails.current = trails.current.slice(-20);
      }

      ctx.clearRect(0, 0, cw, ch);
      trails.current.forEach((t) => {
        t.alpha *= 0.93;
        t.size *= 0.97;
        if (t.alpha > 0.02) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(57, 255, 20, ${t.alpha})`;
          ctx.fill();
        }
      });

      if (Math.random() < 0.05) {
        const hx = pos.current.x + (Math.random() - 0.5) * 60;
        const hy = pos.current.y + (Math.random() - 0.5) * 60;
        const size = 6 + Math.random() * 10;
        const hex = document.createElement("div");
        hex.className = "fixed pointer-events-none z-[9997]";
        hex.style.left = `${hx - size / 2}px`;
        hex.style.top = `${hy - size / 2}px`;
        hex.style.width = `${size}px`;
        hex.style.height = `${size}px`;
        hex.style.clipPath =
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
        hex.style.border = "1px solid rgba(57,255,20,0.2)";
        hex.style.animation = "hexFade 1s ease-out forwards";
        document.body.appendChild(hex);
        setTimeout(() => hex.remove(), 1000);
      }

      requestAnimationFrame(animate);
    }

    const hexStyle = document.createElement("style");
    hexStyle.textContent = `
      @keyframes hexFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5); }
      }
    `;
    document.head.appendChild(hexStyle);

    animate();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.querySelectorAll("button, a").forEach(removeHoverListeners);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      style.remove();
      hexStyle.remove();
    };
  }, [onMouseMove, onMouseDown, onMouseOver, onMouseOut]);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-[#39FF14]/40 transition-[width,height] duration-200 bg-transparent"
        style={{
          width: 24,
          height: 24,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 15px rgba(57,255,20,0.15), inset 0 0 15px rgba(57,255,20,0.05)",
        }}
      />
      <canvas
        ref={trailRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />
    </>
  );
}
