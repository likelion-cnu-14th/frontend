export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description: string;
  amenities: string[];
}

export interface Reservation {
  id: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  userId: string;
  username: string;
  createdAt: string;
  roomName?: string;
}

export interface ReservationCreate {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
}
