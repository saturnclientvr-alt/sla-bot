"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex items-center gap-3 min-w-[320px] px-4 py-3 rounded-xl border border-[#39FF14]/30 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-lg shadow-[#39FF14]/10"
          >
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-[#39FF14]" />
            )}
            {toast.type === "error" && (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            {toast.type === "info" && (
              <Info className="w-5 h-5 text-blue-400" />
            )}
            <span className="flex-1 text-sm text-gray-200">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
