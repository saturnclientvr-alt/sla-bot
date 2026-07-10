"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Download,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Ticket, TicketStatus } from "@/lib/types";

const ADMIN_PASSWORD = "vedl2024";

export function AdminPanel() {
  const {
    isAdmin,
    setIsAdmin,
    tickets,
    updateTicket,
    deleteTicket,
    resetPlayerId,
    resetDiscord,
    addToast,
  } = useApp();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [notes, setNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [showDetails, setShowDetails] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPasswordError(false);
      setPassword("");
      addToast("Admin access granted", "success");
    } else {
      setPasswordError(true);
      addToast("Invalid admin password", "error");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setSelectedTicket(null);
    addToast("Logged out of admin panel", "info");
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.ticketNumber.toLowerCase().includes(q) ||
          t.playerId.includes(q) ||
          t.discordUsername.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, searchQuery, statusFilter]);

  const counts = useMemo(() => {
    return {
      pending: tickets.filter((t) => t.status === "pending").length,
      accepted: tickets.filter((t) => t.status === "accepted").length,
      denied: tickets.filter((t) => t.status === "denied").length,
      "in-review": tickets.filter((t) => t.status === "in-review").length,
    };
  }, [tickets]);

  const handleStatusUpdate = (ticket: Ticket, status: TicketStatus) => {
    updateTicket(ticket.ticketNumber, {
      status,
      reviewNotes: status === "denied" ? notes || "No reason provided" : notes || undefined,
    });
    addToast(`Ticket ${ticket.ticketNumber} ${status}`, status === "accepted" ? "success" : "info");
    setNotes("");
    setSelectedTicket(null);
  };

  const handleDeleteTicket = (ticketNumber: string) => {
    deleteTicket(ticketNumber);
    addToast(`Ticket ${ticketNumber} deleted`, "info");
    setSelectedTicket(null);
  };

  const handleResetPlayerId = () => {
    resetPlayerId();
    addToast("Player ID binding reset", "info");
  };

  const handleResetDiscord = () => {
    resetDiscord();
    addToast("Discord binding reset", "info");
  };

  const handleExport = () => {
    const data = JSON.stringify(tickets, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vedl-tickets-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Tickets exported", "success");
  };

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm mx-auto p-6 sm:p-8 rounded-2xl border border-[#39FF14]/10 bg-[#0a0a0a]/60 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20">
            <Lock className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Admin Access</h2>
            <p className="text-xs text-gray-500">Enter the admin password to continue</p>
          </div>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Enter Admin Password"
          className={`w-full px-4 py-3 bg-[#080808] border rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all ${
            passwordError
              ? "border-red-400/50"
              : "border-[#39FF14]/20 focus:border-[#39FF14]/50"
          }`}
        />
        {passwordError && (
          <p className="text-xs text-red-400 mt-2">Incorrect password</p>
        )}
        <button
          onClick={handleLogin}
          disabled={!password}
          className="w-full mt-4 py-3 bg-[#39FF14] text-black font-semibold rounded-xl text-sm hover:bg-[#00E676] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Unlock Panel
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Admin Dashboard</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 border border-[#39FF14]/10 rounded-lg hover:border-[#39FF14]/30 transition-all"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            { key: "pending", label: "Pending", count: counts.pending },
            { key: "accepted", label: "Accepted", count: counts.accepted },
            { key: "denied", label: "Denied", count: counts.denied },
            { key: "in-review", label: "In Review", count: counts["in-review"] },
          ] as const
        ).map((stat) => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(stat.key)}
            className={`p-4 rounded-xl border transition-all text-left ${
              statusFilter === stat.key
                ? "border-[#39FF14]/30 bg-[#39FF14]/5"
                : "border-[#39FF14]/10 bg-[#0a0a0a]/60 hover:border-[#39FF14]/20"
            }`}
          >
            <p className="text-2xl font-bold text-white">{stat.count}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Player ID or Discord..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#080808] border border-[#39FF14]/20 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 transition-all"
          />
        </div>
        <button
          onClick={() => setStatusFilter("all")}
          className="px-4 py-2.5 text-xs text-gray-400 border border-[#39FF14]/10 rounded-xl hover:border-[#39FF14]/30 transition-all"
        >
          Clear Filter
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleResetPlayerId}
          className="px-4 py-2 text-xs text-yellow-400 border border-yellow-400/20 rounded-xl hover:bg-yellow-400/10 transition-all"
        >
          Reset Player ID
        </button>
        <button
          onClick={handleResetDiscord}
          className="px-4 py-2 text-xs text-yellow-400 border border-yellow-400/20 rounded-xl hover:bg-yellow-400/10 transition-all"
        >
          Reset Discord
        </button>
      </div>

      <div className="grid gap-3">
        {filteredTickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-[#39FF14]/10 bg-[#0a0a0a]/60 backdrop-blur-xl hover:border-[#39FF14]/20 transition-all cursor-pointer"
            onClick={() => {
              setSelectedTicket(ticket);
              setNotes(ticket.reviewNotes || "");
              setShowDetails(true);
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-gray-400">
                  {ticket.ticketNumber}
                </span>
                <p className="text-sm text-white mt-0.5">{ticket.item}</p>
                <p className="text-xs text-gray-500">
                  {ticket.playerId} &middot; {ticket.discordUsername}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                  ticket.status === "pending"
                    ? "text-yellow-400 bg-yellow-400/10"
                    : ticket.status === "accepted"
                    ? "text-[#39FF14] bg-[#39FF14]/10"
                    : ticket.status === "denied"
                    ? "text-red-400 bg-red-400/10"
                    : "text-blue-400 bg-blue-400/10"
                }`}
              >
                {ticket.status}
              </span>
            </div>
          </motion.div>
        ))}
        {filteredTickets.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500">
            No tickets match your criteria
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDetails && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-[#39FF14]/20 bg-[#0a0a0a]/95 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {selectedTicket.ticketNumber}
                </h3>
                <button
                  onClick={() => handleDeleteTicket(selectedTicket.ticketNumber)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Player ID</span>
                  <span className="text-white font-mono">{selectedTicket.playerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discord</span>
                  <span className="text-white">{selectedTicket.discordUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Item</span>
                  <span className="text-white">{selectedTicket.item}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">
                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-white capitalize">{selectedTicket.status}</span>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Message Link</p>
                  <p className="text-[#39FF14] text-xs break-all">{selectedTicket.messageLink}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Server Invite</p>
                  <p className="text-[#39FF14] text-xs break-all">{selectedTicket.serverInvite}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1.5">Review Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#080808] border border-[#39FF14]/20 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedTicket, "accepted")}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 rounded-xl text-sm font-medium hover:bg-[#39FF14]/20 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedTicket, "denied")}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl text-sm font-medium hover:bg-red-400/20 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Deny
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedTicket, "in-review")}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-xl text-sm font-medium hover:bg-blue-400/20 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Request Info
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 text-gray-300 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
