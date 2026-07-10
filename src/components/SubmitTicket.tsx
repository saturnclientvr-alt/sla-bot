"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Ticket, TicketItem } from "@/lib/types";

const items: TicketItem[] = ["Money", "Vehicle", "Weapon", "Property", "Business", "Other"];

interface FormState {
  item: string;
  messageLink: string;
  serverInvite: string;
}

export function SubmitTicket() {
  const { playerId, discordUsername, addTicket, addToast } = useApp();
  const [form, setForm] = useState<FormState>({ item: "", messageLink: "", serverInvite: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit =
    playerId && discordUsername && form.item && form.messageLink && form.serverInvite;

  const validateLinks = () => {
    if (!form.serverInvite.startsWith("https://discord.gg/")) {
      addToast("Server invite must start with https://discord.gg/", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!canSubmit || !validateLinks()) return;
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    setSubmitting(true);
    setTimeout(() => {
      const now = new Date();
      const ticketNumber = `VEDL-${now.getTime().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const ticket: Ticket = {
        id: crypto.randomUUID(),
        ticketNumber,
        playerId: playerId!,
        discordUsername: discordUsername!,
        item: form.item as TicketItem,
        messageLink: form.messageLink,
        serverInvite: form.serverInvite,
        status: "pending",
        notes: "",
        createdAt: now.toISOString(),
      };
      addTicket(ticket);
      setForm({ item: "", messageLink: "", serverInvite: "" });
      addToast(`Ticket ${ticketNumber} submitted successfully!`, "success");
      setSubmitting(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 sm:p-8 rounded-2xl border border-[#39FF14]/10 bg-[#0a0a0a]/60 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-white mb-6">Submit a Ticket</h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#39FF14]/5 border border-[#39FF14]/10">
            <p className="text-xs text-gray-500 mb-1">Player ID</p>
            <p className="text-sm font-medium text-[#39FF14]">
              {playerId || <span className="text-gray-600">Not set</span>}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#39FF14]/5 border border-[#39FF14]/10">
            <p className="text-xs text-gray-500 mb-1">Discord</p>
            <p className="text-sm font-medium text-[#39FF14]">
              {discordUsername || <span className="text-gray-600">Not set</span>}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Select Item</label>
            <select
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
              className="w-full px-4 py-3 bg-[#080808] border border-[#39FF14]/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]/50 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select an item type...
              </option>
              {items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Message Link</label>
            <input
              type="text"
              value={form.messageLink}
              onChange={(e) => setForm({ ...form, messageLink: e.target.value })}
              placeholder="https://discord.com/channels/..."
              className="w-full px-4 py-3 bg-[#080808] border border-[#39FF14]/20 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Server Invite</label>
            <input
              type="text"
              value={form.serverInvite}
              onChange={(e) => setForm({ ...form, serverInvite: e.target.value })}
              placeholder="https://discord.gg/"
              className="w-full px-4 py-3 bg-[#080808] border border-[#39FF14]/20 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="group relative mt-6 w-full py-3.5 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] active:scale-[0.98]"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
              />
              Submitting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Submit Ticket
            </span>
          )}
        </button>
      </div>

      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border border-[#39FF14]/20 bg-[#0a0a0a]/95 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Confirm Ticket</h3>
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Item:</span>
                <span className="text-white">{form.item}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Player ID:</span>
                <span className="text-[#39FF14]">{playerId}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Discord:</span>
                <span className="text-[#39FF14]">{discordUsername}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm text-gray-300 border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-6 py-2 rounded-xl text-sm font-medium text-black bg-[#39FF14] hover:bg-[#00E676] shadow-lg shadow-[#39FF14]/20 transition-all"
              >
                Confirm & Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
