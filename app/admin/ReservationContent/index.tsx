'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReservation, getAllReservations } from "@/api/reservation";
import Dialog from "@/components/Dialog";
import { ReservationData } from "@/types/reservation";
import Image from "next/image";

export default function ReservationContent() {
  const queryClient = useQueryClient();
  const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: getAllReservations,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReservation(id),
    onSuccess: () => {
      alert("예약이 삭제되었습니다.");
      setSelectedReservation(null);
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  return (
    <div className="p-8 bg-gray-50 w-full min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">예약 관리</h1>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <p className="animate-pulse text-gray-400">데이터를 불러오는 중입니다...</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reservations.map((item) => (
            <li
              key={item.id}
              onClick={() => setSelectedReservation(item)}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col"
            >
              {/* 카드 상단 이미지 영역: 그리드 칸을 꽉 채우는 핵심 부분 */}
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  alt={item.reservationTheme.name}
                  src={item.reservationTheme.imageUrl}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                  ID: {item.id}
                </div>
              </div>

              {/* 카드 하단 정보 영역 */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Theme</span>
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {item.reservationTheme.name}
                  </h3>
                </div>
                
                <div className="mt-auto space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📅</span> {item.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⏰</span> {item.time.startAt}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 상세 및 삭제 다이얼로그 */}
      <Dialog
        isOpen={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        title="예약 상세 내역"
        // 다이얼로그 자체의 너비 조절 (Tailwind v3 기준 w-[500px] 식의 임의 값 사용 권장)
        className="w-120 rounded-2xl overflow-hidden" 
      >
        {selectedReservation && (
          <div className="flex flex-col w-full overflow-hidden">
            {/* 1. 상단 이미지 배너 */}
            <div className="relative w-full h-65 group">
              <Image
                src={selectedReservation.reservationTheme.imageUrl}
                alt="theme"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="text-xs text-white/80 uppercase tracking-widest mb-1">Reservation Theme</p>
                <h2 className="text-2xl font-black">{selectedReservation.reservationTheme.name}</h2>
              </div>
            </div>

            <div className="p-8 bg-white relative">
              {/* 2. 상세 정보 섹션 */}
              <div className="space-y-6">
                {/* 예약자 */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Reserved By</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedReservation.name} 고객님</p>
                  </div>
                </div>

                {/* 일시 정보 (그리드) */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-400 uppercase font-bold">Date</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                      <span>📅</span> {selectedReservation.date}
                    </div>
                  </div>
                  <div className="space-y-1 border-l border-gray-200 pl-4">
                    <p className="text-[11px] text-gray-400 uppercase font-bold">Time</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                      <span>⏰</span> {selectedReservation.time.startAt}
                    </div>
                  </div>
                </div>

                {/* 안내 문구 */}
                <p className="text-xs text-center text-gray-400 bg-gray-50 py-2 rounded-lg">
                  예약 시간 10분 전까지 반드시 방문해 주시기 바랍니다.
                </p>
              </div>

              {/* 3. 하단 액션 버튼 */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    if(confirm("정말 예약을 취소하시겠습니까?")) {
                      deleteMutation.mutate(selectedReservation.id);
                    }
                  }}
                  className="flex-[1.5] bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      예약 취소하기
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}