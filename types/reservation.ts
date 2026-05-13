export interface AddReservationRequest {
  name: string;
  date: string;
  themeId: number;
  timeId: number;
}

export interface ReservationInfoData extends Omit<AddReservationRequest, "themeId" | "timeId"> {
  id: number,
  time: TimeData,
  reservationTheme: ThemeData,
}

export interface ReservationData extends AddReservationRequest {
  id: number;
}
