import { ResponseType } from "@/types/api";

const domain = process.env.NEXT_PUBLIC_API_URL as string;

export const getAllTheme = async () => {
  const response = await fetch(domain + "/themes");

  const {errorMessage, data} = await response.json() as ResponseType;

  if(!response.ok) {
    throw new Error(errorMessage ?? "theme 데이터 가져오기 실패")
  }

  return data as ThemeData[];

}

export const deleteTheme = async (id: number) => {
  const resposne = await fetch(domain + `/theme/${id}`, {
    method: "DELETE"
  });

  if(!resposne.ok) {
    const { errorMessage } = await resposne.json() as ResponseType;

    throw new Error(errorMessage ?? "theme 데이터 삭제 실패");
  }
}

export const addTheme = async (payload: AddThemeRequest) => {
  const response = await fetch(`${domain}/themes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  })

  if(!response.ok) {
    const { errorMessage } = await response.json();
    throw new Error(errorMessage ?? "theme 데이터 생성 실패");
  }
}

export const getPopularTheme = async() => {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  const response = await fetch(`${domain}/themes/popular?startDate=${lastWeek.toISOString().split("T")[0]}&endDate=${today.toISOString().split("T")[0]}&size=10`);

  const { errorMessage, data } = await response.json();

  if(!response.ok) {
    throw new Error(errorMessage ?? "인기 테마 가져오기 실패");
  }


  return data as PopularThemeData[];
}