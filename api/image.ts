const key = process.env.NEXT_PUBLIC_IMAGE_API_KEY;

export const getImageUrl = async (formData: FormData) => {
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData
  })

  if(!response.ok) {
    throw new Error("이미지 url 생성 실패");
  }

  const {data: { url }} = await response.json();

  return url as string;
}