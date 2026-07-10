"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabSystemProps {
  tabs: Tab[];
  defaultTab?: string;
  id: string;
}

export function TabSystem({ tabs, defaultTab, id: sectionId }: TabSystemProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <section id={sectionId} className="relative py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex gap-1 p-1.5 rounded-2xl border border-[#39FF14]/10 bg-[#0a0a0a]/60 backdrop-blur-xl overflow-x-auto mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id ? "text-black" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId={`tab-indicator-${sectionId}`}
                  className="absolute inset-0 bg-gradient-to-r from-[#39FF14] to-[#00E676] rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {tabs.find((t) => t.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
