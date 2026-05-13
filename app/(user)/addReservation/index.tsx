'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getAllTheme } from "@/api/theme";
import { getAvailableTimes } from "@/api/time";
import { AddReservationRequest, ReservationData } from "@/types/reservation";
import Dialog from "@/components/Dialog";
import { cn } from "@/lib/cn";
import ThemeItem from "@/app/admin/ThemeContent/ThemeItem";
import ReservationDialogContent from "./ReservationDialogContent";

interface AddReservationProps {
  data?: ReservationData
  onClick?: (date: string, themeId: number, timeId: number) => void;
}

export default function AddReservation({ data, onClick }: AddReservationProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeData | null>(null);

  const formMethods = useForm<AddReservationRequest>({
    defaultValues: { 
      name: data?.name ?? '',
      date: data?.date ?? '',
      themeId: data?.themeId ?? -1,
      timeId: data?.timeId ?? -1,
    }
  });

  const { data: themes = [] } = useQuery({ 
    queryKey: ["theme"], 
    queryFn: getAllTheme 
  });

  const { data: availableTimes = [], isFetching: isTimeLoading } = useQuery({
    queryKey: ["availableTimes", selectedDate, selectedTheme?.id],
    queryFn: () => getAvailableTimes(selectedDate, selectedTheme!.id),
    enabled: !!selectedDate && !!selectedTheme,
  });

  const handleTimeClick = (time: TimeData) => {
    if(data && selectedTheme && selectedDate) {
      onClick?.(selectedDate, selectedTheme?.id ?? -1, time.id);
      return;
    }
    setSelectedTime(time);
  };

  const handleDialogClose = () => {
    setSelectedTime(null);
    formMethods.resetField("name");
  };

  return (
    <div className="flex w-full flex-1 bg-gray-50">
      <div className="w-1/2 p-8 border-r bg-white overflow-y-auto">
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">1. 날짜 선택</h2>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTheme(null);
            }}
            className="w-full p-4 border rounded-2xl text-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2. 테마 선택</h2>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <div 
                key={theme.id} 
                onClick={() => setSelectedTheme(theme)}
              >
                <ThemeItem value={theme} onClick={() => {}} isSelected={selectedTheme?.id === theme.id} /> {/* 클릭은 부모 div에서 처리 */}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="w-1/2 p-8 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">3. 예약 가능 시간</h2>
        {!selectedTheme ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>날짜와 테마를 먼저 선택해주세요.</p>
          </div>
        ) : isTimeLoading ? (
          <div className="text-center py-10">시간 목록을 불러오는 중...</div>
        ) : availableTimes.length === 0 ? (
          <div className="text-center py-10 text-red-500 font-medium">
            예약 가능한 시간이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {availableTimes.map((time) => (
              <button
                key={time.id}
                onClick={() => handleTimeClick(time)}
                disabled={!time.isAvailable}
                className={cn("py-4 rounded-xl border-2 border-gray-200 bg-white font-bold text-lg shadow-sm", time.isAvailable && "hover:border-blue-500 hover:text-blue-600 transition-all", !time.isAvailable && "opacity-25")}
              >
                {time.startAt}
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog 
        isOpen={!!selectedTime} 
        onClose={handleDialogClose}
        className="rounded-3xl"
      >
        {selectedTime && selectedTheme && (
          <ReservationDialogContent 
            date={selectedDate}
            theme={selectedTheme}
            time={selectedTime}
            onClose={handleDialogClose}
            formMethods={formMethods}
          />
        )}
      </Dialog>
    </div>
  );
}