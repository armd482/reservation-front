'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { deleteReservation, getAllReservationsByName, updateReservation } from "@/api/reservation";
import Dialog from "@/components/Dialog";
import { ReservationInfoData, ReservationData } from "@/types/reservation";
import Image from "next/image";
import AddReservation from "../addReservation";

interface SearchForm {
  searchName: string;
}

export default function Reservation() {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>("");
  const [selectedReservation, setSelectedReservation] = useState<ReservationInfoData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit } = useForm<SearchForm>();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations", name],
    queryFn: () => getAllReservationsByName(name),
    enabled: Boolean(name),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ReservationData) => updateReservation(payload),
    onSuccess: () => {
      alert("예약이 성공적으로 수정되었습니다.");
      setIsEditing(false);
      setSelectedReservation(null);
      queryClient.invalidateQueries({ queryKey: ["reservations", name] });
    },
    onError: (errors) => {
      alert(errors.message);
    }
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
    }
  });

  const onSubmit = (data: SearchForm) => {
    setName(data.searchName);
  };

  const handleUpdateSubmit = (date: string, themeId: number, timeId: number) => {
    if (!selectedReservation) return;

    const isUnchanged = 
      selectedReservation.date === date &&
      selectedReservation.reservationTheme.id === themeId &&
      selectedReservation.time.id === timeId;

    if (isUnchanged) {
      alert("변경 사항이 없습니다. 새로운 날짜나 시간을 선택해 주세요.");
      return;
    }

    const payload: ReservationData = {
      id: selectedReservation.id,
      name: selectedReservation.name,
      date,
      themeId,
      timeId
    };

    updateMutation.mutate(payload);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-2">예약 조회</h1>
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

        {/* 예약 카드 목록 섹션 */}
        {isLoading ? (
          <div className="flex justify-center py-20 animate-pulse text-gray-400">데이터를 불러오는 중...</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reservations.map((item) => (
              <li
                key={item.id}
                onClick={() => setSelectedReservation(item)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative w-full h-44">
                  <Image alt={item.reservationTheme.name} src={item.reservationTheme.imageUrl} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{item.reservationTheme.name}</h3>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <span>📅 {item.date}</span>
                    <span className="font-bold text-gray-700">⏰ {item.time.startAt}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog
        isOpen={Boolean(selectedReservation)}
        onClose={() => {
          setSelectedReservation(null);
          setIsEditing(false);
        }}
        title={isEditing ? "예약 수정" : "예약 상세 내역"}
        className={isEditing ? "max-w-5xl w-[90vw]" : "max-w-md w-full"}
      >
        {selectedReservation && (
          isEditing ? (
            <div className="h-[75vh] min-h-150 overflow-hidden flex rounded-2xl">
              <AddReservation 
                data={{
                  id: selectedReservation.id,
                  name: selectedReservation.name,
                  date: selectedReservation.date,
                  themeId: selectedReservation.reservationTheme.id,
                  timeId: selectedReservation.time.id
                }} 
                onClick={handleUpdateSubmit} 
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="relative w-full h-52">
                <Image src={selectedReservation.reservationTheme.imageUrl} alt="theme" fill className="object-cover" sizes="(max-width: 448px) 100vw, 448px" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <h2 className="text-2xl font-black text-white">{selectedReservation.reservationTheme.name}</h2>
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
                  <button onClick={() => setIsEditing(true)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
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
    </div>
  );
}