"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TicketStatus } from "@/lib/types";

const statusConfig: Record<
  TicketStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    color: "text-[#39FF14] border-[#39FF14]/20 bg-[#39FF14]/5",
    icon: CheckCircle,
  },
  denied: {
    label: "Denied",
    color: "text-red-400 border-red-400/20 bg-red-400/5",
    icon: XCircle,
  },
  "in-review": {
    label: "In Review",
    color: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    icon: RefreshCw,
  },
};

const filterTabs: { key: TicketStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "denied", label: "Denied" },
  { key: "in-review", label: "In Review" },
];

export function MyTickets() {
  const { tickets } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TicketStatus | "all">("all");

  const filtered = tickets.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.item.toLowerCase().includes(q) ||
        t.playerId.includes(q)
      );
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#080808] border border-[#39FF14]/20 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                filter === tab.key
                  ? "bg-[#39FF14] text-black"
                  : "text-gray-400 border border-[#39FF14]/10 hover:border-[#39FF14]/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No tickets found</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4">
            {filtered.map((ticket) => {
              const config = statusConfig[ticket.status];
              const Icon = config.icon;
              return (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 rounded-2xl border border-[#39FF14]/10 bg-[#0a0a0a]/60 backdrop-blur-xl hover:border-[#39FF14]/20 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-gray-400">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-white font-medium mb-1">
                        {ticket.item}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {ticket.reviewNotes && (
                        <p className="text-xs text-gray-400 mt-2 italic">
                          Note: {ticket.reviewNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
