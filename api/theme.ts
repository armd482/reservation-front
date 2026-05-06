const domain = process.env.NEXT_PUBLIC_API_URL as string;

export const getAllTheme = async () => {
  const response = await fetch(domain + "/themes");

  if(!response.ok) {
    throw new Error("theme 데이터 가져오기 실패")
  }

  const data = await response.json();
  return data as ThemeData[];

}

export const deleteTheme = async (id: number) => {
  const resposne = await fetch(domain + `/theme/${id}`, {
    method: "DELETE"
  });

  if(!resposne.ok) {
    throw new Error("theme 데이터 삭제 실패");
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
    throw new Error("theme 데이터 생성 실패");
  }
}

export const getPopularTheme = async() => {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const response = await fetch(`${domain}/themes/popular?start_date=${lastWeek.toISOString().split("T")[0]}&end_date=${today.toISOString().split("T")[0]}&size=10`);

  if(!response.ok) {
    throw new Error("인기 테마 가져오기 실패");
  }

  const data = await response.json();

  return data as PopularThemeData[];
}