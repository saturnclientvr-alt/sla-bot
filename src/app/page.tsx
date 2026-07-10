"use client";

import { Hero } from "@/components/Hero";
import { TabSystem } from "@/components/TabSystem";
import { PlayerID } from "@/components/PlayerID";
import { DiscordVerify } from "@/components/DiscordVerify";
import { SubmitTicket } from "@/components/SubmitTicket";
import { MyTickets } from "@/components/MyTickets";
import { AdminPanel } from "@/components/AdminPanel";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

function LeaderboardSection() {
  return (
    <section id="leaderboard" className="relative py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-white mb-4"
        >
          Leaderboard
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500"
        >
          Coming soon. Top players will be ranked here based on their activity and
          contributions.
        </motion.p>
      </div>
    </section>
  );
}

function RulesSection() {
  return (
    <section id="rules" className="relative py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center"
        >
          Rules & Guidelines
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Player ID",
              desc: "Must be numeric only. Once bound, it is permanently linked to your device.",
            },
            {
              title: "Discord",
              desc: "Must start with @. Your Discord account must be verified before submitting tickets.",
            },
            {
              title: "Tickets",
              desc: "Provide accurate information. False submissions may result in a ban.",
            },
            {
              title: "Conduct",
              desc: "Respect staff decisions. Abusive behavior will not be tolerated.",
            },
          ].map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border border-[#39FF14]/10 bg-[#0a0a0a]/60 backdrop-blur-xl hover:border-[#39FF14]/20 transition-all"
            >
              <h3 className="text-sm font-semibold text-white mb-2">{rule.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative py-8 px-4 border-t border-[#39FF14]/5">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="w-5 h-5" fill="none">
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
          <span className="text-sm font-bold text-gray-400">
            VEDL &mdash; Virtual Elite Dragons League
          </span>
        </div>
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} VEDL. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  const { loading } = useApp();

  if (loading) return null;

  return (
    <>
      <Hero />
      <TabSystem
        id="tickets"
        tabs={[
          { id: "player-id", label: "Player ID", content: <PlayerID /> },
          { id: "discord", label: "Discord", content: <DiscordVerify /> },
          { id: "submit", label: "Submit Ticket", content: <SubmitTicket /> },
          { id: "my-tickets", label: "My Tickets", content: <MyTickets /> },
          { id: "admin", label: "Admin", content: <AdminPanel /> },
        ]}
      />
      <LeaderboardSection />
      <RulesSection />
      <Footer />
    </>
  );
}
