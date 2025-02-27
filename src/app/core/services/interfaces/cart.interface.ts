export interface CartItem {
  eventId: number;
  eventTitle: string;
  sessionDate: string;
  quantity: number;
}

export interface CartSession {
  sessionDate: string;
  quantity: number;
}

export interface CartGroup {
  eventTitle: string;
  eventId: number;
  sessions: CartSession[];
}
