'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { deleteReservation, getAllReservationsByName } from "@/api/reservation";
import Dialog from "@/components/Dialog";
import { ReservationData } from "@/types/reservation";
import Image from "next/image";

interface SearchForm {
  searchName: string;
}

export default function Reservation() {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>("");
  const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);

  const { register, handleSubmit } = useForm<SearchForm>();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations", name],
    queryFn: () => getAllReservationsByName(name),
    enabled: Boolean(name),
  });

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
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-2">예약 조회</h1>
          <p className="text-gray-500 mb-6">성함을 입력하시면 예약 내역을 확인하실 수 있습니다.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto flex gap-2">
            <input
              {...register("searchName", { required: true })}
              placeholder="예약자 성함을 입력하세요"
              className="flex-1 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl shadow-sm outline-none transition-all"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
              조회
            </button>
          </form>
        </header>

        {/* 목록 섹션 */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reservations.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setSelectedReservation(item)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* 카드 상단 이미지 */}
                  <div className="relative w-full h-44">
                    <Image
                      alt={item.reservationTheme.name}
                      src={item.reservationTheme.imageUrl}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* 카드 하단 정보 */}
                  <div className="p-5 flex-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">Theme</span>
                    <h3 className="text-lg font-bold text-gray-800 mt-2 mb-4 truncate">
                      {item.reservationTheme.name}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
                      <span className="flex items-center gap-1 font-medium">📅 {item.date}</span>
                      <span className="flex items-center gap-1 font-medium text-gray-700 underline decoration-blue-200 underline-offset-4">⏰ {item.time.startAt}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {name && reservations.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-lg">"{name}"님으로 등록된 예약 내역이 없습니다.</p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog
        isOpen={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        title="예약 상세 내역"
        className="max-w-112.5"
      >
        {selectedReservation && (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="relative w-full h-52 group">
              <Image
                src={selectedReservation.reservationTheme.imageUrl}
                alt="theme"
                fill
                sizes="(max-width: 450px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 text-white">
                <h2 className="text-2xl font-black">{selectedReservation.reservationTheme.name}</h2>
              </div>
            </div>

            <div className="p-8 bg-white">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Reserved By</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedReservation.name} 고객님</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-lg">👤</div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-400 uppercase font-bold">Date</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700">📅 {selectedReservation.date}</div>
                  </div>
                  <div className="space-y-1 border-l border-gray-200 pl-4">
                    <p className="text-[11px] text-gray-400 uppercase font-bold">Time</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700">⏰ {selectedReservation.time.startAt}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    if(confirm("정말 취소하시겠습니까?")) deleteMutation.mutate(selectedReservation.id);
                  }}
                  className="flex-[1.5] bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "처리 중..." : "예약 취소"}
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