"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Tickets", href: "#tickets" },
  { label: "My Tickets", href: "#my-tickets" },
  { label: "Admin", href: "#admin" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Rules", href: "#rules" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#080808]/80 backdrop-blur-xl border-b border-[#39FF14]/10 shadow-lg shadow-[#39FF14]/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button onClick={() => scrollTo("#home")} className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-6 h-6 sm:w-7 sm:h-7" fill="none">
                <path
                  d="M50 10 L70 30 L65 55 L50 65 L35 55 L30 30 Z"
                  stroke="#39FF14"
                  strokeWidth="2"
                  fill="rgba(57,255,20,0.15)"
                />
                <path
                  d="M50 35 L58 43 L56 52 L50 56 L44 52 L42 43 Z"
                  fill="#39FF14"
                  opacity="0.5"
                />
              </svg>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white tracking-wider group-hover:text-[#39FF14] transition-colors">
                VEDL
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase leading-tight">
                Virtual Elite Dragons League
              </p>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="relative px-3 py-2 text-sm text-gray-400 hover:text-[#39FF14] transition-colors rounded-lg hover:bg-white/[0.02] group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#39FF14] transition-all duration-300 group-hover:w-1/2 rounded-full" />
              </button>
            ))}
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 text-sm font-medium text-black bg-[#39FF14] rounded-xl hover:bg-[#00E676] transition-all shadow-lg shadow-[#39FF14]/20 hover:shadow-[#39FF14]/40"
            >
              Discord
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-[#39FF14] hover:bg-white/5 transition-all"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-[#39FF14]/10 bg-[#080808]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:text-[#39FF14] hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 text-sm font-medium text-black bg-[#39FF14] rounded-xl hover:bg-[#00E676] transition-all mt-2"
              >
                Discord
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
