export interface AddReservationRequest {
  name: string;
  date: string;
  themeId: number;
  timeId: number;
}

export interface ReservationData extends Omit<AddReservationRequest, "themeId" | "timeId"> {
  id: number,
  time: TimeData,
  reservationTheme: ThemeData,
}