// 스터디룸 정보
export interface Room {
    id: string;
    name: string;
    location: string;
    capacity: number;
    description: string;
    amenities: string[];
}

// 예약 정보
export interface Reservation {
    id: string;
    roomId: string;
    roomName?: string; // 내 예약 조회 시에만 포함
    date: string; // "YYYY-MM-DD"
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
    purpose: string;
    userId: string;
    username: string;
    createdAt: string;
}

// 예약 생성 요청
export interface ReservationCreate {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
}