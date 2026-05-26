'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReservation, getAllReservations, getAllWaitingReservations, deleteWaitingReservation } from "@/api/reservation";
import Dialog from "@/components/Dialog";
import { ReservationInfoData, WaitingReservationInfoData } from "@/types/reservation";
import Image from "next/image";

type TabType = 'reservation' | 'waiting';

export default function ReservationContent() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabType>('reservation');
  const [selectedReservation, setSelectedReservation] = useState<ReservationInfoData | null>(null);
  const [selectedWaiting, setSelectedWaiting] = useState<WaitingReservationInfoData | null>(null);

  const { data: reservations = [], isLoading: isReservationLoading, refetch: refetchReservations } = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: getAllReservations,
    staleTime: 0,
  });

  const { data: waitingList = [], isLoading: isWaitingLoading, refetch: refetchWaiting } = useQuery({
    queryKey: ["admin", "waitingReservations"],
    queryFn: getAllWaitingReservations,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReservation(id, selectedReservation?.name ?? ''),
    onSuccess: () => {
      alert("예약이 삭제되었습니다.");
      setSelectedReservation(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "reservations"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const deleteWaitingMutation = useMutation({
    mutationFn: (id: number) => deleteWaitingReservation(id, selectedWaiting?.name ?? ''),
    onSuccess: () => {
      alert("대기 예약이 취소되었습니다.");
      setSelectedWaiting(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "waitingReservations"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    if (newTab === 'reservation') refetchReservations();
    else refetchWaiting();
  };

  const isLoading = tab === 'reservation' ? isReservationLoading : isWaitingLoading;

  return (
    <div className="flex flex-1 flex-col p-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto w-full">
      <header className="mb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">전체 예약</h1>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl max-w-xs">
          <button
            onClick={() => handleTabChange('reservation')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'reservation'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            예약 조회
          </button>
          <button
            onClick={() => handleTabChange('waiting')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'waiting'
                ? 'bg-white text-amber-500 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            예약 대기
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <p className="animate-pulse text-gray-400">데이터를 불러오는 중입니다...</p>
        </div>
      ) : tab === 'reservation' ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reservations.map((item) => (
            <li
              key={item.id}
              onClick={() => setSelectedReservation(item)}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  alt={item.theme.name}
                  src={item.theme.url}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                  ID: {item.id}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Theme</span>
                  <h3 className="text-lg font-bold text-gray-900 truncate">{item.theme.name}</h3>
                </div>
                <div className="mt-auto space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👤</span> {item.name}
                  </div>
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
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {waitingList.map((item) => (
            <li
              key={item.id}
              onClick={() => setSelectedWaiting(item)}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  alt={item.theme.name}
                  src={item.theme.url}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  대기 {item.sequence}번
                </div>
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                  ID: {item.id}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Waiting</span>
                  <h3 className="text-lg font-bold text-gray-900 truncate">{item.theme.name}</h3>
                </div>
                <div className="mt-auto space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">👤</span> {item.name}
                  </div>
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

      {/* 예약 상세 다이얼로그 */}
      <Dialog
        isOpen={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        title="예약 상세 내역"
        className="w-120 rounded-2xl overflow-hidden"
      >
        {selectedReservation && (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="relative w-full h-65 group">
              <Image
                src={selectedReservation.theme.url}
                alt="theme"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 448px) 100vw, 448px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="text-xs text-white/80 uppercase tracking-widest mb-1">Reservation Theme</p>
                <h2 className="text-2xl font-black">{selectedReservation.theme.name}</h2>
              </div>
            </div>
            <div className="p-8 bg-white">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Reserved By</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedReservation.name} 고객님</p>
                  </div>
                </div>
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
                <p className="text-xs text-center text-gray-400 bg-gray-50 py-2 rounded-lg">
                  예약 시간 10분 전까지 반드시 방문해 주시기 바랍니다.
                </p>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    if (confirm("정말 예약을 취소하시겠습니까?")) {
                      deleteMutation.mutate(selectedReservation.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="flex-[1.5] bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "예약 취소하기"
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

      {/* 대기 예약 상세 다이얼로그 */}
      <Dialog
        isOpen={Boolean(selectedWaiting)}
        onClose={() => setSelectedWaiting(null)}
        title="대기 예약 상세 내역"
        className="w-120 rounded-2xl overflow-hidden"
      >
        {selectedWaiting && (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="relative w-full h-65 group">
              <Image
                src={selectedWaiting.theme.url}
                alt="theme"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 448px) 100vw, 448px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="text-xs text-white/80 uppercase tracking-widest mb-1">Waiting Theme</p>
                <h2 className="text-2xl font-black">{selectedWaiting.theme.name}</h2>
              </div>
            </div>
            <div className="p-8 bg-white">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">Reserved By</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedWaiting.name} 고객님</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center">
                    <p className="text-[11px] text-amber-400 uppercase font-bold">대기 순번</p>
                    <p className="text-xl font-black text-amber-500">{selectedWaiting.sequence}번</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-400 uppercase font-bold">Date</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                      <span>📅</span> {selectedWaiting.date}
                    </div>
                  </div>
                  <div className="space-y-1 border-l border-gray-200 pl-4">
                    <p className="text-[11px] text-gray-400 uppercase font-bold">Time</p>
                    <div className="flex items-center gap-2 font-medium text-gray-700">
                      <span>⏰</span> {selectedWaiting.time.startAt}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    if (confirm("정말 대기 예약을 취소하시겠습니까?")) {
                      deleteWaitingMutation.mutate(selectedWaiting.id);
                    }
                  }}
                  disabled={deleteWaitingMutation.isPending}
                  className="flex-[1.5] bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {deleteWaitingMutation.isPending ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "대기 취소하기"
                  )}
                </button>
                <button
                  onClick={() => setSelectedWaiting(null)}
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
    </div>
  );
}
