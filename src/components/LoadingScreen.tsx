"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";

export function LoadingScreen() {
  const { loading, setLoading } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808]"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-24 h-24 rounded-full border-2 border-transparent border-t-[#39FF14] border-r-[#00E676] shadow-lg shadow-[#39FF14]/20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-14 h-14"
                fill="none"
              >
                <motion.path
                  d="M50 10 L70 30 L65 55 L50 65 L35 55 L30 30 Z"
                  stroke="#39FF14"
                  strokeWidth="2"
                  fill="rgba(57,255,20,0.1)"
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d="M50 35 L58 43 L56 52 L50 56 L44 52 L42 43 Z"
                  fill="#39FF14"
                  opacity={0.3}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </svg>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <h1 className="text-2xl font-bold text-[#39FF14] tracking-widest">
              VEDL
            </h1>
            <p className="text-xs text-gray-500 mt-1 tracking-[0.3em] uppercase">
              Virtual Elite Dragons League
            </p>
          </motion.div>
          <motion.div
            className="mt-8 flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#39FF14]"
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
