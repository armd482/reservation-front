export interface AddReservationRequest {
  name: string;
  date: string;
  themeId: number;
  timeId: number;
}

export interface ReservationInfoData extends Omit<AddReservationRequest, "themeId" | "timeId"> {
  id: number,
  time: TimeData,
  theme: ThemeData,
}

export interface ReservationData extends AddReservationRequest {
  id: number;
  originalName?: string;
}

export interface WaitingReservationInfoData extends Omit<AddReservationRequest, "themeId" | "timeId"> {
  id: number;
  sequence: number;
  time: TimeData;
  theme: ThemeData;
}
