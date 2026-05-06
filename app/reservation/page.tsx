'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { deleteReservation, getAllReservationsByName } from "@/api/reservation";
import Dialog from "@/components/Dialog";
import { ReservationData } from "@/types/reservation";

interface SearchForm {
  searchName: string;
}

export default function Reservation() {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>("");
  const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);

  // 1. 검색 폼 관리
  const { register, handleSubmit } = useForm<SearchForm>();

  // 2. 예약 목록 조회
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations", name],
    queryFn: () => getAllReservationsByName(name),
    enabled: Boolean(name),
  });

  // 3. 예약 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReservation(id),
    onSuccess: () => {
      alert("예약이 삭제되었습니다.");
      setSelectedReservation(null);
      queryClient.invalidateQueries({ queryKey: ["reservations", name] });
    },
  });

  const onSubmit = (data: SearchForm) => {
    setName(data.searchName);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* 검색 섹션 */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex gap-2">
        <input
          {...register("searchName", { required: true })}
          placeholder="예약자 이름을 입력하세요"
          className="border p-2 flex-1 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          조회
        </button>
      </form>

      {/* 목록 섹션 */}
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <ul className="space-y-2">
          {reservations.map((item) => (
            <li
              key={item.id}
              onClick={() => setSelectedReservation(item)}
              className="border p-4 rounded cursor-pointer hover:bg-gray-50 transition"
            >
              <p className="font-bold">{item.reservationTheme.name}</p>
              <p className="text-sm text-gray-600">{item.date} | {item.time.startAt}</p>
            </li>
          ))}
          {name && reservations.length === 0 && <p>검색 결과가 없습니다.</p>}
        </ul>
      )}

      {/* 상세 및 삭제 다이얼로그 */}
      <Dialog
        isOpen={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        title="예약 상세 정보"
      >
        {selectedReservation && (
          <div className="p-6 w-[320px]">
            <h2 className="text-xl font-bold mb-4">예약 상세</h2>
            <div className="space-y-2 mb-6">
              <p><strong>예약자:</strong> {selectedReservation.name}</p>
              <p><strong>테마:</strong> {selectedReservation.reservationTheme.name}</p>
              <p><strong>날짜:</strong> {selectedReservation.date}</p>
              <p><strong>시간:</strong> {selectedReservation.time.startAt}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => deleteMutation.mutate(selectedReservation.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "삭제 중..." : "예약 삭제"}
              </button>
              <button
                onClick={() => setSelectedReservation(null)}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}