"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Ticket } from "@/lib/types";
import { storage } from "@/lib/store";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  playerId: string | null;
  discordUsername: string | null;
  deviceLinked: boolean;
  tickets: Ticket[];
  isAdmin: boolean;
  setPlayerId: (id: string) => void;
  setDiscordUsername: (name: string) => void;
  setDeviceLinked: (linked: boolean) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticketNumber: string, updates: Partial<Ticket>) => void;
  deleteTicket: (ticketNumber: string) => void;
  setIsAdmin: (auth: boolean) => void;
  resetPlayerId: () => void;
  resetDiscord: () => void;
  toasts: Toast[];
  addToast: (message: string, type: Toast["type"]) => void;
  removeToast: (id: string) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [playerId, setPlayerIdState] = useState<string | null>(
    () => storage.getPlayerId()
  );
  const [discordUsername, setDiscordUsernameState] = useState<string | null>(
    () => storage.getDiscordUsername()
  );
  const [deviceLinked, setDeviceLinkedState] = useState<boolean>(
    () => storage.isDeviceLinked()
  );
  const [tickets, setTickets] = useState<Ticket[]>(() => storage.getTickets());
  const [isAdmin, setIsAdminState] = useState<boolean>(() => storage.isAdmin());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);

  const setPlayerId = useCallback((id: string) => {
    storage.setPlayerId(id);
    setPlayerIdState(id);
  }, []);

  const setDiscordUsername = useCallback((name: string) => {
    storage.setDiscordUsername(name);
    setDiscordUsernameState(name);
  }, []);

  const setDeviceLinked = useCallback((linked: boolean) => {
    storage.setDeviceLinked(linked);
    setDeviceLinkedState(linked);
  }, []);

  const addTicket = useCallback((ticket: Ticket) => {
    storage.addTicket(ticket);
    setTickets(storage.getTickets());
  }, []);

  const updateTicket = useCallback(
    (ticketNumber: string, updates: Partial<Ticket>) => {
      storage.updateTicket(ticketNumber, updates);
      setTickets(storage.getTickets());
    },
    []
  );

  const deleteTicket = useCallback((ticketNumber: string) => {
    storage.deleteTicket(ticketNumber);
    setTickets(storage.getTickets());
  }, []);

  const setIsAdmin = useCallback((auth: boolean) => {
    storage.setAdmin(auth);
    setIsAdminState(auth);
  }, []);

  const resetPlayerIdFn = useCallback(() => {
    storage.resetPlayerId();
    setPlayerIdState(null);
    setDeviceLinkedState(false);
  }, []);

  const resetDiscordFn = useCallback(() => {
    storage.resetDiscord();
    setDiscordUsernameState(null);
  }, []);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        playerId,
        discordUsername,
        deviceLinked,
        tickets,
        isAdmin,
        setPlayerId,
        setDiscordUsername,
        setDeviceLinked,
        addTicket,
        updateTicket,
        deleteTicket,
        setIsAdmin,
        resetPlayerId: resetPlayerIdFn,
        resetDiscord: resetDiscordFn,
        toasts,
        addToast,
        removeToast,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
