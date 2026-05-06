const domain = process.env.NEXT_PUBLIC_API_URL as string;

export const getAllTime = async () => {
  const response = await fetch(`${domain}/times`)

  if(!response.ok) {
    throw new Error("전체 시간 가져오기 실패")
  }

  const data = await response.json();
  return data as TimeData[];
}

export const getAvailableTimes = async (date: string, themeId: number) => {
  const response = await fetch(`${domain}/times/availability?date=${date}&themeId=${themeId}`, {
  })

  if(!response.ok) {
    throw new Error("이용 가능 시간 가져오기 실패");
  }

  const data = await response.json();

  return data as AvailableTimeData[];
}

export const deleteTime = async (id: number) => {
  const resposne = await fetch(domain + `/times/${id}`, {
    method: "DELETE"
  });

  if(!resposne.ok) {
    throw new Error("time 데이터 삭제 실패");
  }
}

export const addTime = async(payload: AddTimeRequest) => {
  const response = await fetch(`${domain}/times`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  })

  if(!response.ok) {
    throw new Error("theme 데이터 생성 실패");
  }
}