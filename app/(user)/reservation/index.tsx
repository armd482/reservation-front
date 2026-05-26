'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  deleteReservation,
  getAllReservationsByName,
  updateReservation,
  getAllWaitingReservationsByName,
  deleteWaitingReservation,
} from "@/api/reservation";
import Dialog from "@/components/Dialog";
import { ReservationInfoData, ReservationData, WaitingReservationInfoData } from "@/types/reservation";
import Image from "next/image";
import AddReservation from "../addReservation";

type TabType = 'reservation' | 'waiting';

interface SearchForm {
  searchName: string;
}

export default function Reservation() {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>("");
  const [tab, setTab] = useState<TabType>('reservation');

  const [selectedReservation, setSelectedReservation] = useState<ReservationInfoData | null>(null);
  const [selectedWaiting, setSelectedWaiting] = useState<WaitingReservationInfoData | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSelectingDateTime, setIsSelectingDateTime] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [pendingDate, setPendingDate] = useState('');
  const [pendingTheme, setPendingTheme] = useState<ThemeData | null>(null);
  const [pendingTime, setPendingTime] = useState<AvailableTimeData | null>(null);

  const { register, handleSubmit } = useForm<SearchForm>();

  const { data: reservations = [], isLoading: isReservationLoading, refetch: refetchReservations } = useQuery({
    queryKey: ["reservations", name],
    queryFn: () => getAllReservationsByName(name),
    enabled: Boolean(name),
    staleTime: 0,
  });

  const { data: waitingList = [], isLoading: isWaitingLoading, refetch: refetchWaiting } = useQuery({
    queryKey: ["waitingReservations", name],
    queryFn: () => getAllWaitingReservationsByName(name),
    enabled: Boolean(name),
    staleTime: 0,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ReservationData) => updateReservation(payload),
    onSuccess: () => {
      alert("예약이 성공적으로 수정되었습니다.");
      setIsEditing(false);
      setSelectedReservation(null);
      queryClient.invalidateQueries({ queryKey: ["reservations", name] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReservation(id, name),
    onSuccess: () => {
      alert("예약이 삭제되었습니다.");
      setSelectedReservation(null);
      queryClient.invalidateQueries({ queryKey: ["reservations", name] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const deleteWaitingMutation = useMutation({
    mutationFn: (id: number) => deleteWaitingReservation(id, name),
    onSuccess: () => {
      alert("대기 예약이 취소되었습니다.");
      setSelectedWaiting(null);
      queryClient.invalidateQueries({ queryKey: ["waitingReservations", name] });
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

  const onSubmit = (data: SearchForm) => {
    setName(data.searchName);
    setTab('reservation');
  };

  const handleStartEdit = () => {
    if (!selectedReservation) return;
    setPendingName(selectedReservation.name);
    setPendingDate(selectedReservation.date);
    setPendingTheme(selectedReservation.theme);
    setPendingTime({ ...selectedReservation.time, isAvailable: true });
    setIsEditing(true);
  };

  const handleDateTimeSelected = (date: string, theme: ThemeData, time: AvailableTimeData) => {
    setPendingDate(date);
    setPendingTheme(theme);
    setPendingTime(time);
    setIsSelectingDateTime(false);
  };

  const handleUpdateSubmit = () => {
    if (!selectedReservation || !pendingTheme || !pendingTime) return;

    const isUnchanged =
      selectedReservation.name === pendingName &&
      selectedReservation.date === pendingDate &&
      selectedReservation.theme.id === pendingTheme.id &&
      selectedReservation.time.id === pendingTime.id;

    if (isUnchanged) {
      alert("변경 사항이 없습니다.");
      return;
    }

    if (!pendingTime.isAvailable) {
      alert("해당 시간에 이미 예약이 존재합니다. 대기열로 들어갑니다.");
    }

    updateMutation.mutate({
      id: selectedReservation.id,
      name: pendingName,
      originalName: selectedReservation.name,
      date: pendingDate,
      themeId: pendingTheme.id,
      timeId: pendingTime.id,
    });
  };

  const handleCloseDetail = () => {
    setSelectedReservation(null);
    setIsEditing(false);
    setIsSelectingDateTime(false);
  };

  const isLoading = tab === 'reservation' ? isReservationLoading : isWaitingLoading;
  const isEmpty = tab === 'reservation' ? reservations.length === 0 : waitingList.length === 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">예약 조회하기</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto flex gap-2">
            <input
              {...register("searchName", { required: true })}
              placeholder="예약자 성함을 입력하세요"
              className="flex-1 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 p-4 rounded-2xl shadow-sm outline-none transition-all"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
              조회
            </button>
          </form>
        </header>

        {name && (
          <>
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl max-w-xs">
              <button
                onClick={() => handleTabChange('reservation')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === 'reservation' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                예약 조회
              </button>
              <button
                onClick={() => handleTabChange('waiting')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === 'waiting' ? 'bg-white text-amber-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                대기 조회
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20 animate-pulse text-gray-400">데이터를 불러오는 중...</div>
            ) : isEmpty ? (
              <div className="flex justify-center py-20 text-gray-400">
                {tab === 'reservation' ? '예약 내역이 없습니다.' : '대기 예약 내역이 없습니다.'}
              </div>
            ) : tab === 'reservation' ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {reservations.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => setSelectedReservation(item)}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="relative w-full h-44">
                      <Image alt={item.theme.name} src={item.theme.url} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{item.theme.name}</h3>
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <span>📅 {item.date}</span>
                        <span className="font-bold text-gray-700">⏰ {item.time.startAt}</span>
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
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="relative w-full h-44">
                      <Image alt={item.theme.name} src={item.theme.url} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" />
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        대기 {item.sequence}번
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{item.theme.name}</h3>
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <span>📅 {item.date}</span>
                        <span className="font-bold text-gray-700">⏰ {item.time.startAt}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* 예약 상세 / 수정 다이얼로그 */}
      <Dialog
        isOpen={Boolean(selectedReservation)}
        onClose={handleCloseDetail}
        title={isEditing ? "예약 수정" : "예약 상세 내역"}
        className="max-w-md w-full"
      >
        {selectedReservation && (
          isEditing ? (
            <div className="flex flex-col">
              <div className="relative w-full h-44">
                <Image src={pendingTheme?.url ?? selectedReservation.theme.url} alt="theme" fill className="object-cover" sizes="(max-width: 448px) 100vw, 448px" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <h2 className="text-xl font-black text-white">{pendingTheme?.name ?? selectedReservation.theme.name}</h2>
                </div>
              </div>
              <div className="p-8 space-y-5 bg-white">
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-2">예약자 이름</p>
                  <input
                    value={pendingName}
                    onChange={(e) => setPendingName(e.target.value)}
                    className="w-full border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 p-3 rounded-xl outline-none transition-all text-gray-800 font-medium"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-2">일정</p>
                  <button
                    onClick={() => setIsSelectingDateTime(true)}
                    className="relative w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 transition-all group"
                  >
                    <div className="space-y-1.5 text-sm text-gray-700">
                      <p>📅 {pendingDate}</p>
                      <p>🎭 {pendingTheme?.name}</p>
                      <p>⏰ {pendingTime?.startAt}</p>
                    </div>
                    <p className="absolute bottom-3 right-4 text-xs text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">변경하기 →</p>
                  </button>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleUpdateSubmit}
                    disabled={updateMutation.isPending}
                    className="flex-2 bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {updateMutation.isPending ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : "업데이트"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="relative w-full h-52">
                <Image src={selectedReservation.theme.url} alt="theme" fill className="object-cover" sizes="(max-width: 448px) 100vw, 448px" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <h2 className="text-2xl font-black text-white">{selectedReservation.theme.name}</h2>
                </div>
              </div>
              <div className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">DATE</p>
                    <p className="font-semibold">📅 {selectedReservation.date}</p>
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <p className="text-xs text-gray-400 font-bold mb-1">TIME</p>
                    <p className="font-semibold">⏰ {selectedReservation.time.startAt}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleStartEdit} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
                    수정하기
                  </button>
                  <button
                    onClick={() => confirm("정말 삭제하시겠습니까?") && deleteMutation.mutate(selectedReservation.id)}
                    className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </Dialog>

      {/* 날짜/테마/시간 선택 모달 */}
      <Dialog
        isOpen={isSelectingDateTime}
        onClose={() => setIsSelectingDateTime(false)}
        title="날짜/테마/시간 선택"
        className="max-w-5xl w-[90vw] rounded-2xl overflow-hidden"
        zIndex={2200}
      >
        <div className="relative h-[75vh] min-h-150 overflow-hidden flex">
          <button
            onClick={() => setIsSelectingDateTime(false)}
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md"
          >
            ✕
          </button>
          {selectedReservation && (
            <AddReservation
              data={{
                id: selectedReservation.id,
                name: pendingName,
                date: pendingDate,
                themeId: pendingTheme?.id ?? selectedReservation.theme.id,
                timeId: pendingTime?.id ?? selectedReservation.time.id,
              }}
              onClick={handleDateTimeSelected}
            />
          )}
        </div>
      </Dialog>

      {/* 대기 예약 상세 다이얼로그 */}
      <Dialog
        isOpen={Boolean(selectedWaiting)}
        onClose={() => setSelectedWaiting(null)}
        title="대기 예약 상세 내역"
        className="max-w-md w-full"
      >
        {selectedWaiting && (
          <div className="flex flex-col">
            <div className="relative w-full h-52">
              <Image src={selectedWaiting.theme.url} alt="theme" fill className="object-cover" sizes="(max-width: 448px) 100vw, 448px" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <h2 className="text-2xl font-black text-white">{selectedWaiting.theme.name}</h2>
              </div>
            </div>
            <div className="p-8 space-y-6 bg-white">
              <div className="flex items-center justify-center bg-amber-50 border border-amber-200 rounded-2xl py-4">
                <span className="text-amber-600 font-black text-xl">대기 순번 {selectedWaiting.sequence}번</span>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl">
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">DATE</p>
                  <p className="font-semibold">📅 {selectedWaiting.date}</p>
                </div>
                <div className="border-l border-gray-200 pl-4">
                  <p className="text-xs text-gray-400 font-bold mb-1">TIME</p>
                  <p className="font-semibold">⏰ {selectedWaiting.time.startAt}</p>
                </div>
              </div>
              <button
                onClick={() => confirm("대기 예약을 취소하시겠습니까?") && deleteWaitingMutation.mutate(selectedWaiting.id)}
                disabled={deleteWaitingMutation.isPending}
                className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {deleteWaitingMutation.isPending ? (
                  <span className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : "대기 취소하기"}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
