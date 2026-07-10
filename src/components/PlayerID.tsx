"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function PlayerID() {
  const { playerId, deviceLinked, setPlayerId, setDeviceLinked, addToast } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBind = () => {
    if (!input.trim()) return;
    if (!/^\d+$/.test(input)) {
      addToast("Player ID must contain only numbers.", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setPlayerId(input.trim());
      setDeviceLinked(true);
      addToast("Player ID successfully bound to this device!", "success");
      setLoading(false);
    }, 800);
  };

  if (playerId && deviceLinked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-2xl border border-[#39FF14]/20 bg-[#0a0a0a]/60 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20">
            <CheckCircle className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Player ID Verified</h2>
            <p className="text-xs text-gray-500">Permanently linked to this device</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#39FF14]/5 border border-[#39FF14]/10">
          <p className="text-xs text-gray-500 mb-1">Linked Player ID</p>
          <p className="text-xl font-bold text-[#39FF14] tracking-wider">{playerId}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          Cannot be changed unless reset by an administrator
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 rounded-2xl border border-[#39FF14]/10 bg-[#0a0a0a]/60 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20">
          <Shield className="w-5 h-5 text-[#39FF14]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Verify Player ID</h2>
          <p className="text-xs text-gray-500">
            Numbers only. Once confirmed, your Player ID is permanently linked to this device.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
          placeholder="Player ID"
          maxLength={20}
          className="flex-1 px-4 py-3 bg-[#080808] border border-[#39FF14]/20 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 focus:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-all"
        />
        <button
          onClick={handleBind}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-[#39FF14] text-black font-semibold rounded-xl text-sm hover:bg-[#00E676] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#39FF14]/20 hover:shadow-[#39FF14]/40 active:scale-[0.97]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
              />
              Binding...
            </span>
          ) : (
            "Bind Player ID"
          )}
        </button>
      </div>
    </motion.div>
  );
}
