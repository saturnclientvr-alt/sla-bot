export type TicketStatus = "pending" | "accepted" | "denied" | "in-review";

export type TicketItem = "Money" | "Vehicle" | "Weapon" | "Property" | "Business" | "Other";

export interface Ticket {
  id: string;
  ticketNumber: string;
  playerId: string;
  discordUsername: string;
  item: TicketItem;
  messageLink: string;
  serverInvite: string;
  status: TicketStatus;
  notes: string;
  createdAt: string;
  reviewNotes?: string;
}

export interface AppData {
  playerId: string | null;
  discordUsername: string | null;
  tickets: Ticket[];
  isAdmin: boolean;
  deviceLinked: boolean;
}
