import { Ticket } from "./types";

const KEYS = {
  PLAYER_ID: "vedl_player_id",
  DISCORD_USERNAME: "vedl_discord_username",
  DEVICE_LINKED: "vedl_device_linked",
  TICKETS: "vedl_tickets",
  ADMIN_AUTH: "vedl_admin_auth",
} as const;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* empty */
  }
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* empty */
  }
}

export const storage = {
  getPlayerId: () => getItem<string | null>(KEYS.PLAYER_ID, null),
  setPlayerId: (id: string) => setItem(KEYS.PLAYER_ID, id),

  getDiscordUsername: () => getItem<string | null>(KEYS.DISCORD_USERNAME, null),
  setDiscordUsername: (name: string) => setItem(KEYS.DISCORD_USERNAME, name),

  isDeviceLinked: () => getItem<boolean>(KEYS.DEVICE_LINKED, false),
  setDeviceLinked: (linked: boolean) => setItem(KEYS.DEVICE_LINKED, linked),

  getTickets: () => getItem<Ticket[]>(KEYS.TICKETS, []),
  setTickets: (tickets: Ticket[]) => setItem(KEYS.TICKETS, tickets),

  isAdmin: () => getItem<boolean>(KEYS.ADMIN_AUTH, false),
  setAdmin: (auth: boolean) => setItem(KEYS.ADMIN_AUTH, auth),

  resetPlayerId: () => {
    removeItem(KEYS.PLAYER_ID);
    removeItem(KEYS.DEVICE_LINKED);
  },

  resetDiscord: () => {
    removeItem(KEYS.DISCORD_USERNAME);
  },

  clearAll: () => {
    Object.values(KEYS).forEach(removeItem);
  },

  addTicket: (ticket: Ticket) => {
    const tickets = storage.getTickets();
    tickets.unshift(ticket);
    storage.setTickets(tickets);
  },

  updateTicket: (ticketNumber: string, updates: Partial<Ticket>) => {
    const tickets = storage.getTickets();
    const index = tickets.findIndex((t) => t.ticketNumber === ticketNumber);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], ...updates };
      storage.setTickets(tickets);
    }
  },

  deleteTicket: (ticketNumber: string) => {
    const tickets = storage.getTickets();
    storage.setTickets(tickets.filter((t) => t.ticketNumber !== ticketNumber));
  },
};
