"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

const rand = (min: number, max: number) => {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return min + (arr[0] / (0xffffffff + 1)) * (max - min);
};

function HexagonGrid() {
  const hexagons = useMemo(() => {
    const items: { x: number; y: number; delay: number; size: number }[] = [];
    for (let i = 0; i < 30; i++) {
      items.push({
        x: rand(0, 100),
        y: rand(0, 100),
        delay: rand(0, 5),
        size: 20 + rand(0, 40),
      });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern
            id="hexgrid"
            width="56"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M28 0L56 16.67V50L28 66.67L0 50V16.67Z"
              fill="none"
              stroke="#39FF14"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexgrid)" />
      </svg>
      {hexagons.map((h, i) => (
        <motion.div
          key={i}
          className="absolute border border-[#39FF14]/10"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            width: h.size,
            height: h.size,
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
          animate={{
            opacity: [0.05, 0.2, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + h.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: h.delay,
          }}
        />
      ))}
    </div>
  );
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: (rand(0, 1) - 0.5) * 0.3,
        vy: (rand(0, 1) - 0.5) * 0.3,
        size: 1 + rand(0, 2),
        alpha: 0.1 + rand(0, 0.4),
      });
    }

    function onResize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", onResize);

    let animId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 20, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

function GlowingBlobs() {
  const blobs = useMemo(() => {
    return [
      { x: 15, y: 20, size: 400, color: "#39FF14", delay: 0 },
      { x: 80, y: 60, size: 350, color: "#00E676", delay: 2 },
      { x: 50, y: 80, size: 300, color: "#66FF66", delay: 4 },
      { x: 70, y: 30, size: 250, color: "#39FF14", delay: 1 },
    ];
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px]"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            opacity: [0.08, 0.15, 0.08],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 8 + blob.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}

function GridOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.02]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(57, 255, 20, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

function Splatters() {
  const splatters = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      x: 10 + rand(0, 80),
      y: 10 + rand(0, 80),
      size: 100 + rand(0, 200),
      rotation: rand(0, 360),
      opacity: 0.02 + rand(0, 0.03),
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {splatters.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: `radial-gradient(circle at 30% 30%, #39FF14, transparent)`,
            opacity: s.opacity,
            transform: `rotate(${s.rotation}deg)`,
            filter: "blur(8px)",
          }}
        />
      ))}
    </div>
  );
}

export function Background() {
  return (
    <div className="fixed inset-0 bg-[#080808] z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808]" />
      <GridOverlay />
      <HexagonGrid />
      <GlowingBlobs />
      <Particles />
      <Splatters />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(57,255,20,0.03)_0%,transparent_70%)]" />
    </div>
  );
}
