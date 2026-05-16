import { ResponseType } from "@/types/api";
import { AddReservationRequest, ReservationData, ReservationInfoData } from "@/types/reservation";

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
    const { errorMessage } = await response.json() as ResponseType;
    throw new Error(errorMessage ?? "예약 생성 실패");
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
  const response = await fetch(`${domain}/reservations?name=${name}`);

  const data  = await response.json();
  
  if(!response.ok) {
    throw new Error(data?.errorMessage ?? "예약 생성 실패");
  }

  return data as ReservationInfoData[];
}

export const deleteReservation = async (id: number, name: string) => {
  const response = await fetch(`${domain}/reservations/${id}`, {
    method:"DELETE",
    headers: {
      "name": encodeURIComponent(name),
    }
  });


  if(!response.ok) {
    const { errorMessage } = await response.json() as ResponseType;
    throw new Error(errorMessage ?? "예약 삭제 실패");
  }
}

export const updateReservation = async(payload: ReservationData) => {
  const response = await fetch(`${domain}/reservations/${payload.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "name": encodeURIComponent(payload.name),
    },
    body: JSON.stringify(payload),
  })

  if(!response.ok) {
    const { errorMessage } = await response.json();
    throw new Error(errorMessage ?? "예약 삭제 실패");
  }
}