import { AddReservationRequest, ReservationData } from "@/types/reservation";

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
    throw new Error("예약 생성 실패");
  }
}


export const getAllReservations = async() => {
  const response = await fetch(`${domain}/reservations`);

  if(!response.ok) {
    throw new Error("예약 생성 실패");
  }

  const data = await response.json();
  return data as ReservationData[];
}

export const getAllReservationsByName = async (name: String) => {
  const response = await fetch(`${domain}/reservations?name=${name}`);
  
  if(!response.ok) {
    throw new Error("예약 생성 실패");
  }

  const data = await response.json();
  
  return data as ReservationData[];
}

export const deleteReservation = async (id: number) => {
  const response = await fetch(`${domain}/reservations/${id}`, {
    method:"DELETE"
  });

  if(!response.ok) {
    throw new Error("예약 삭제 실패");
  }
}
