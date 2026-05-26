import { ResponseType } from "@/types/api";
import { AddReservationRequest, ReservationData, ReservationInfoData, WaitingReservationInfoData } from "@/types/reservation";

const domain = process.env.NEXT_PUBLIC_API_URL as string;

export const createReservation = async (payload: AddReservationRequest) => {
  const response = await fetch(`${domain}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if(!response.ok) {
    const { message } = await response.json() as ResponseType;
    throw new Error(message ?? "예약 생성 실패");
  }
}


export const getAllReservations = async() => {
  const response = await fetch(`${domain}/reservations`);

  if(!response.ok) {
    throw new Error("예약 생성 실패");
  }

  const data = await response.json();
  return data as ReservationInfoData[];
}

export const getAllReservationsByName = async (name: String) => {
  const response = await fetch(`${domain}/reservations/mine?name=${name}`);

  const data  = await response.json();
  
  if(!response.ok) {
    throw new Error(data?.message ?? "예약 생성 실패");
  }

  return data as ReservationInfoData[];
}

export const deleteReservation = async (id: number, name: string) => {
  const response = await fetch(`${domain}/reservations/${id}`, {
    method:"DELETE",
  });


  if(!response.ok) {
    const { message } = await response.json() as ResponseType;
    throw new Error(message ?? "예약 삭제 실패");
  }
}

export const updateReservation = async(payload: ReservationData) => {
  const response = await fetch(`${domain}/reservations/${payload.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if(!response.ok) {
    const { message } = await response.json();
    throw new Error(message ?? "예약 삭제 실패");
  }
}

export const createWaitingReservations = async (payload: AddReservationRequest) => {
  const response = await fetch(`${domain}/reservations/waitings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const { message } = await response.json() as ResponseType;
    throw new Error(message ?? "대기열 등록 실패");
  }
}

export const getAllWaitingReservations = async () => {
  const response = await fetch(`${domain}/reservations/waitings`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "대기 예약 조회 실패");
  }

  return data as WaitingReservationInfoData[];
}

export const getAllWaitingReservationsByName = async (name: string) => {
  const response = await fetch(`${domain}/reservations/waitings/mine?name=${name}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "대기 예약 조회 실패");
  }

  return data as WaitingReservationInfoData[];
}

export const deleteWaitingReservation = async (id: number, name: string) => {
  const response = await fetch(`${domain}/reservations/waitings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const { message } = await response.json() as ResponseType;
    throw new Error(message ?? "대기 예약 취소 실패");
  }
}