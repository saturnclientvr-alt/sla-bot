"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  danger = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md p-6 rounded-2xl border border-[#39FF14]/20 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-xl ${
                  danger
                    ? "bg-red-500/10 text-red-400"
                    : "bg-[#39FF14]/10 text-[#39FF14]"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm text-gray-300 border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-all ${
                  danger
                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
                    : "bg-[#39FF14] hover:bg-[#00E676] text-black shadow-lg shadow-[#39FF14]/20"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
