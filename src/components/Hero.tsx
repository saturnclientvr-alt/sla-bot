"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              filter: ["drop-shadow(0 0 20px rgba(57,255,20,0.3))", "drop-shadow(0 0 40px rgba(57,255,20,0.6))", "drop-shadow(0 0 20px rgba(57,255,20,0.3))"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-2xl bg-[#39FF14]/5 border border-[#39FF14]/20 flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" fill="none">
              <motion.path
                d="M50 8 L75 30 L68 60 L50 72 L32 60 L25 30 Z"
                stroke="#39FF14"
                strokeWidth="2"
                fill="rgba(57,255,20,0.1)"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M50 35 L60 45 L57 55 L50 59 L43 55 L40 45 Z"
                fill="#39FF14"
                opacity="0.6"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
        >
          VEDL{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] via-[#00E676] to-[#66FF66]">
            Tickets & Verification
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Verify your Player ID and Discord account before submitting item tickets
          for review by the VEDL administration team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo("tickets")}
            className="group relative px-6 py-3 sm:px-8 sm:py-3.5 bg-[#39FF14] text-black font-semibold rounded-2xl text-sm sm:text-base overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Finalized Tickets
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-[#00E676]"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-6 py-3 sm:px-8 sm:py-3.5 border border-[#39FF14]/30 text-[#39FF14] font-semibold rounded-2xl text-sm sm:text-base hover:bg-[#39FF14]/10 hover:border-[#39FF14]/50 transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Discord Server
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-[#39FF14]/30 flex justify-center pt-2">
          <motion.div
            className="w-1 h-2 rounded-full bg-[#39FF14]"
            animate={{ opacity: [1, 0.2, 1], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
